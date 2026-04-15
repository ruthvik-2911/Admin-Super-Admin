package org.jackfruit.keliri.service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.jackfruit.keliri.model.SuperAdminAnalyticsResponse;
import org.jackfruit.keliri.model.ad_campaigns;
import org.jackfruit.keliri.model.advertisements;
import org.jackfruit.keliri.model.dateRange;
import org.jackfruit.keliri.model.location;
import org.jackfruit.keliri.model.txn_user_locations;
import org.jackfruit.keliri.model.users;
import org.jackfruit.keliri.repository.ad_campaignsRepository;
import org.jackfruit.keliri.repository.advertisementsRepository;
import org.jackfruit.keliri.repository.txn_user_locationsRepository;
import org.jackfruit.keliri.repository.usersRepository;
import org.springframework.stereotype.Service;

@Service
public class SuperAdminAnalyticsService {
    private static final ZoneId ZONE_ID = ZoneId.systemDefault();
    private static final DateTimeFormatter MONTH_LABEL = DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH);

    private final ad_campaignsRepository campaignsRepository;
    private final advertisementsRepository advertisementsRepository;
    private final usersRepository usersRepository;
    private final txn_user_locationsRepository userLocationsRepository;

    public SuperAdminAnalyticsService(
            ad_campaignsRepository campaignsRepository,
            advertisementsRepository advertisementsRepository,
            usersRepository usersRepository,
            txn_user_locationsRepository userLocationsRepository) {
        this.campaignsRepository = campaignsRepository;
        this.advertisementsRepository = advertisementsRepository;
        this.usersRepository = usersRepository;
        this.userLocationsRepository = userLocationsRepository;
    }

    public SuperAdminAnalyticsResponse getAnalytics() {
        List<ad_campaigns> campaigns = campaignsRepository.findAll();
        List<users> publishers = usersRepository.findAll();
        Map<String, advertisements> adsById = loadAdvertisements(campaigns);
        Map<String, users> creatorsById = loadCreators(campaigns);
        Map<String, txn_user_locations> publisherLocations = loadPublisherLocations(publishers);

        List<ad_campaigns> geoCampaigns = campaigns.stream().filter(this::hasTargetLocation).toList();
        List<ad_campaigns> activeCampaigns = campaigns.stream().filter(this::isActiveCampaign).toList();

        SuperAdminAnalyticsResponse response = new SuperAdminAnalyticsResponse();
        response.setKpis(buildKpis(campaigns, activeCampaigns, geoCampaigns));
        response.setTopCampaigns(buildTopCampaigns(campaigns, adsById));
        response.setAdTypeBreakdown(buildAdTypeBreakdown(campaigns, adsById));
        response.setLocationRows(buildLocationRows(campaigns));
        response.setRadiusBreakdown(buildRadiusBreakdown(geoCampaigns));
        response.setTopLocation(findTopLocation(campaigns));
        response.setCreatorRows(buildCreatorRows(campaigns, creatorsById));
        response.setCampaignsPerCreator(buildCampaignsPerCreator(campaigns, creatorsById));
        response.setPublisherRows(buildPublisherRows(publishers, publisherLocations, geoCampaigns));
        response.setMonthlyTrend(buildMonthlyTrend(campaigns));
        response.setWeeklyTrend(buildWeeklyTrend(campaigns));
        response.setDurationBreakdown(buildDurationBreakdown(campaigns));
        return response;
    }

    private List<SuperAdminAnalyticsResponse.MetricCard> buildKpis(
            List<ad_campaigns> campaigns,
            List<ad_campaigns> activeCampaigns,
            List<ad_campaigns> geoCampaigns) {
        long uniqueLocations = geoCampaigns.stream()
                .map(ad_campaigns::getLocation)
                .filter(Objects::nonNull)
                .map(this::locationKey)
                .collect(Collectors.toSet())
                .size();

        double averageRadius = round(averageRadius(geoCampaigns));

        return List.of(
                new SuperAdminAnalyticsResponse.MetricCard("Total Campaigns", String.valueOf(campaigns.size()), growthForMonth(campaigns, null)),
                new SuperAdminAnalyticsResponse.MetricCard("Active Campaigns", String.valueOf(activeCampaigns.size()), growthForMonth(campaigns, this::isActiveCampaign)),
                new SuperAdminAnalyticsResponse.MetricCard("Geo Targeted", String.valueOf(geoCampaigns.size()), growthForMonth(campaigns, this::hasTargetLocation)),
                new SuperAdminAnalyticsResponse.MetricCard("Unique Locations", String.valueOf(uniqueLocations), locationGrowth(campaigns)),
                new SuperAdminAnalyticsResponse.MetricCard("Avg Radius", String.format(Locale.ENGLISH, "%.2f km", averageRadius), radiusGrowth(campaigns)),
                new SuperAdminAnalyticsResponse.MetricCard("Publishers", String.valueOf(usersRepository.findAll().size()), publisherGrowth())
        );
    }

    private List<SuperAdminAnalyticsResponse.NamedCount> buildTopCampaigns(
            List<ad_campaigns> campaigns,
            Map<String, advertisements> adsById) {
        Map<String, Long> counts = campaigns.stream()
                .map(campaign -> {
                    advertisements ad = adsById.get(campaign.getAdvertisementId());
                    return ad != null && ad.getTitle() != null ? ad.getTitle() : "Untitled";
                })
                .collect(Collectors.groupingBy(name -> name, Collectors.counting()));

        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> new SuperAdminAnalyticsResponse.NamedCount(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<SuperAdminAnalyticsResponse.NamedCount> buildAdTypeBreakdown(
            List<ad_campaigns> campaigns,
            Map<String, advertisements> adsById) {
        Map<String, Long> counts = new HashMap<>();
        for (ad_campaigns campaign : campaigns) {
            advertisements ad = adsById.get(campaign.getAdvertisementId());
            String adType = ad != null && ad.getAdType() != null && !ad.getAdType().isBlank() ? ad.getAdType() : "Unknown";
            counts.merge(adType, 1L, Long::sum);
        }
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new SuperAdminAnalyticsResponse.NamedCount(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<SuperAdminAnalyticsResponse.LocationRow> buildLocationRows(List<ad_campaigns> campaigns) {
        Map<String, List<ad_campaigns>> grouped = campaigns.stream()
                .filter(this::hasTargetLocation)
                .collect(Collectors.groupingBy(campaign -> locationLabel(campaign.getLocation())));

        return grouped.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue().size(), a.getValue().size()))
                .map(entry -> {
                    SuperAdminAnalyticsResponse.LocationRow row = new SuperAdminAnalyticsResponse.LocationRow();
                    row.setCity(entry.getKey());
                    row.setCampaigns(entry.getValue().size());
                    row.setActiveCampaigns(entry.getValue().stream().filter(this::isActiveCampaign).count());
                    row.setAverageRadiusKm(round(averageRadius(entry.getValue())));
                    row.setStatus(row.getActiveCampaigns() > 0 ? "Active" : "Inactive");
                    return row;
                })
                .limit(10)
                .toList();
    }

    private List<SuperAdminAnalyticsResponse.NamedValue> buildRadiusBreakdown(List<ad_campaigns> campaigns) {
        Map<String, Long> buckets = new LinkedHashMap<>();
        buckets.put("0-1 km", 0L);
        buckets.put("1-2 km", 0L);
        buckets.put("2-5 km", 0L);
        buckets.put("5-10 km", 0L);
        buckets.put("10+ km", 0L);

        for (ad_campaigns campaign : campaigns) {
            double radiusKm = campaign.getLocation().getRange() / 1000.0;
            String bucket = radiusKm <= 1 ? "0-1 km"
                    : radiusKm <= 2 ? "1-2 km"
                    : radiusKm <= 5 ? "2-5 km"
                    : radiusKm <= 10 ? "5-10 km"
                    : "10+ km";
            buckets.put(bucket, buckets.get(bucket) + 1);
        }

        return buckets.entrySet().stream()
                .map(entry -> new SuperAdminAnalyticsResponse.NamedValue(entry.getKey(), entry.getValue()))
                .toList();
    }

    private String findTopLocation(List<ad_campaigns> campaigns) {
        return buildLocationRows(campaigns).stream()
                .findFirst()
                .map(SuperAdminAnalyticsResponse.LocationRow::getCity)
                .orElse("No targeted location");
    }

    private List<SuperAdminAnalyticsResponse.CreatorRow> buildCreatorRows(
            List<ad_campaigns> campaigns,
            Map<String, users> creatorsById) {
        Map<String, List<ad_campaigns>> grouped = campaigns.stream()
                .filter(campaign -> campaign.getCreatedBy() != null && !campaign.getCreatedBy().isBlank())
                .collect(Collectors.groupingBy(ad_campaigns::getCreatedBy));

        List<SuperAdminAnalyticsResponse.CreatorRow> rows = new ArrayList<>();
        for (Map.Entry<String, List<ad_campaigns>> entry : grouped.entrySet()) {
            users creator = creatorsById.get(entry.getKey());
            List<ad_campaigns> creatorCampaigns = entry.getValue();
            Set<String> locations = creatorCampaigns.stream()
                    .filter(this::hasTargetLocation)
                    .map(campaign -> locationKey(campaign.getLocation()))
                    .collect(Collectors.toSet());

            SuperAdminAnalyticsResponse.CreatorRow row = new SuperAdminAnalyticsResponse.CreatorRow();
            row.setName(creator != null && creator.getFullName() != null ? creator.getFullName() : "Creator " + shortId(entry.getKey()));
            row.setCampaigns(creatorCampaigns.size());
            row.setActiveCampaigns(creatorCampaigns.stream().filter(this::isActiveCampaign).count());
            row.setTargetedLocations(locations.size());
            rows.add(row);
        }

        rows.sort(Comparator.comparingLong(SuperAdminAnalyticsResponse.CreatorRow::getCampaigns).reversed());
        for (int i = 0; i < rows.size(); i++) {
            rows.get(i).setRank(i + 1);
        }
        return rows.stream().limit(10).toList();
    }

    private List<SuperAdminAnalyticsResponse.NamedValue> buildCampaignsPerCreator(
            List<ad_campaigns> campaigns,
            Map<String, users> creatorsById) {
        return buildCreatorRows(campaigns, creatorsById).stream()
                .limit(6)
                .map(row -> new SuperAdminAnalyticsResponse.NamedValue(shortName(row.getName()), row.getCampaigns()))
                .toList();
    }

    private List<SuperAdminAnalyticsResponse.PublisherRow> buildPublisherRows(
            List<users> publishers,
            Map<String, txn_user_locations> publisherLocations,
            List<ad_campaigns> geoCampaigns) {
        List<SuperAdminAnalyticsResponse.PublisherRow> rows = new ArrayList<>();
        for (users publisher : publishers) {
            txn_user_locations location = publisher.getLastKnownLocation() != null
                    ? publisherLocations.get(publisher.getLastKnownLocation())
                    : null;
            long nearbyCampaigns = location == null ? 0 : countNearbyCampaigns(location, geoCampaigns, false);
            long nearbyActiveCampaigns = location == null ? 0 : countNearbyCampaigns(location, geoCampaigns, true);

            SuperAdminAnalyticsResponse.PublisherRow row = new SuperAdminAnalyticsResponse.PublisherRow();
            row.setName(publisher.getFullName() != null ? publisher.getFullName() : "Publisher");
            row.setLocation(location == null ? "Unknown" : formatPoint(location));
            row.setCampaignsNearby(nearbyCampaigns);
            row.setActiveCampaignsNearby(nearbyActiveCampaigns);
            row.setStatus(nearbyActiveCampaigns > 0 ? "Active" : "Inactive");
            rows.add(row);
        }

        rows.sort(Comparator.comparingLong(SuperAdminAnalyticsResponse.PublisherRow::getCampaignsNearby).reversed());
        return rows.stream().limit(10).toList();
    }

    private long countNearbyCampaigns(txn_user_locations publisherLocation, List<ad_campaigns> campaigns, boolean activeOnly) {
        double publisherLat = publisherLocation.getLocation().getY();
        double publisherLng = publisherLocation.getLocation().getX();

        return campaigns.stream()
                .filter(campaign -> !activeOnly || isActiveCampaign(campaign))
                .filter(campaign -> {
                    location target = campaign.getLocation();
                    if (target == null || target.getLat() == null || target.getLng() == null) {
                        return false;
                    }
                    try {
                        double lat = Double.parseDouble(target.getLat());
                        double lng = Double.parseDouble(target.getLng());
                        double radiusKm = target.getRange() / 1000.0;
                        return haversineKm(publisherLat, publisherLng, lat, lng) <= Math.max(radiusKm, 1.0);
                    } catch (NumberFormatException ex) {
                        return false;
                    }
                })
                .count();
    }

    private List<SuperAdminAnalyticsResponse.NamedValue> buildMonthlyTrend(List<ad_campaigns> campaigns) {
        YearMonth current = YearMonth.now(ZONE_ID);
        Map<YearMonth, Long> grouped = new LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            grouped.put(current.minusMonths(i), 0L);
        }
        for (ad_campaigns campaign : campaigns) {
            YearMonth month = YearMonth.from(resolveCampaignTimestamp(campaign).atZone(ZONE_ID));
            if (grouped.containsKey(month)) {
                grouped.put(month, grouped.get(month) + 1);
            }
        }
        return grouped.entrySet().stream()
                .map(entry -> new SuperAdminAnalyticsResponse.NamedValue(entry.getKey().format(MONTH_LABEL), entry.getValue()))
                .toList();
    }

    private List<SuperAdminAnalyticsResponse.NamedValue> buildWeeklyTrend(List<ad_campaigns> campaigns) {
        WeekFields weekFields = WeekFields.ISO;
        Map<String, Long> grouped = new LinkedHashMap<>();
        Instant now = Instant.now();
        for (int i = 5; i >= 0; i--) {
            Instant instant = now.minusSeconds(7L * 24 * 60 * 60 * i);
            int week = instant.atZone(ZONE_ID).get(weekFields.weekOfWeekBasedYear());
            grouped.put("Wk " + week, 0L);
        }
        for (ad_campaigns campaign : campaigns) {
            int week = resolveCampaignTimestamp(campaign).atZone(ZONE_ID).get(weekFields.weekOfWeekBasedYear());
            String key = "Wk " + week;
            if (grouped.containsKey(key)) {
                grouped.put(key, grouped.get(key) + 1);
            }
        }
        return grouped.entrySet().stream()
                .map(entry -> new SuperAdminAnalyticsResponse.NamedValue(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<SuperAdminAnalyticsResponse.NamedValue> buildDurationBreakdown(List<ad_campaigns> campaigns) {
        Map<String, List<Long>> buckets = new LinkedHashMap<>();
        buckets.put("0-7 days", new ArrayList<>());
        buckets.put("8-30 days", new ArrayList<>());
        buckets.put("31-90 days", new ArrayList<>());
        buckets.put("90+ days", new ArrayList<>());

        for (ad_campaigns campaign : campaigns) {
            long days = campaignDurationDays(campaign);
            double radiusKm = campaign.getLocation() == null ? 0 : campaign.getLocation().getRange() / 1000.0;
            String bucket = days <= 7 ? "0-7 days"
                    : days <= 30 ? "8-30 days"
                    : days <= 90 ? "31-90 days"
                    : "90+ days";
            buckets.get(bucket).add(Math.round(radiusKm));
        }

        List<SuperAdminAnalyticsResponse.NamedValue> values = new ArrayList<>();
        for (Map.Entry<String, List<Long>> entry : buckets.entrySet()) {
            double avg = entry.getValue().isEmpty()
                    ? 0
                    : entry.getValue().stream().mapToLong(Long::longValue).average().orElse(0);
            values.add(new SuperAdminAnalyticsResponse.NamedValue(entry.getKey(), round(avg)));
        }
        return values;
    }

    private Map<String, advertisements> loadAdvertisements(List<ad_campaigns> campaigns) {
        List<String> adIds = campaigns.stream()
                .map(ad_campaigns::getAdvertisementId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        if (adIds.isEmpty()) {
            return Collections.emptyMap();
        }
        return advertisementsRepository.findDashboardAdsByIds(adIds).stream()
                .collect(Collectors.toMap(advertisements::getId, ad -> ad));
    }

    private Map<String, users> loadCreators(List<ad_campaigns> campaigns) {
        List<String> ids = campaigns.stream()
                .map(ad_campaigns::getCreatedBy)
                .filter(Objects::nonNull)
                .filter(id -> !id.isBlank())
                .distinct()
                .toList();
        if (ids.isEmpty()) {
            return Collections.emptyMap();
        }
        return usersRepository.findDashboardUsersByIds(ids).stream()
                .collect(Collectors.toMap(users::getId, user -> user));
    }

    private Map<String, txn_user_locations> loadPublisherLocations(List<users> publishers) {
        List<String> ids = publishers.stream()
                .map(users::getLastKnownLocation)
                .filter(Objects::nonNull)
                .filter(id -> !id.isBlank())
                .distinct()
                .toList();
        if (ids.isEmpty()) {
            return Collections.emptyMap();
        }
        return userLocationsRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(txn_user_locations::getId, location -> location));
    }

    private boolean isActiveCampaign(ad_campaigns campaign) {
        return campaign.getCompaignsStatus() != null && "ACTIVE".equalsIgnoreCase(campaign.getCompaignsStatus());
    }

    private boolean hasTargetLocation(ad_campaigns campaign) {
        location location = campaign.getLocation();
        return location != null
                && ((location.getLocationName() != null && !location.getLocationName().isBlank())
                || (location.getLat() != null && !location.getLat().isBlank()
                && location.getLng() != null && !location.getLng().isBlank()));
    }

    private String locationLabel(location location) {
        if (location.getLocationName() != null && !location.getLocationName().isBlank()) {
            return location.getLocationName();
        }
        return location.getLat() + ", " + location.getLng();
    }

    private String locationKey(location location) {
        return locationLabel(location).toLowerCase(Locale.ENGLISH);
    }

    private double averageRadius(Collection<ad_campaigns> campaigns) {
        return campaigns.stream()
                .filter(campaign -> campaign.getLocation() != null)
                .filter(campaign -> campaign.getLocation().getRange() > 0)
                .mapToDouble(campaign -> campaign.getLocation().getRange() / 1000.0)
                .average()
                .orElse(0);
    }

    private double growthForMonth(List<ad_campaigns> campaigns, java.util.function.Predicate<ad_campaigns> predicate) {
        YearMonth current = YearMonth.now(ZONE_ID);
        YearMonth previous = current.minusMonths(1);
        long currentCount = campaigns.stream()
                .filter(campaign -> predicate == null || predicate.test(campaign))
                .filter(campaign -> YearMonth.from(resolveCampaignTimestamp(campaign).atZone(ZONE_ID)).equals(current))
                .count();
        long previousCount = campaigns.stream()
                .filter(campaign -> predicate == null || predicate.test(campaign))
                .filter(campaign -> YearMonth.from(resolveCampaignTimestamp(campaign).atZone(ZONE_ID)).equals(previous))
                .count();
        return growth(currentCount, previousCount);
    }

    private double locationGrowth(List<ad_campaigns> campaigns) {
        YearMonth current = YearMonth.now(ZONE_ID);
        YearMonth previous = current.minusMonths(1);
        long currentCount = uniqueLocationsForMonth(campaigns, current);
        long previousCount = uniqueLocationsForMonth(campaigns, previous);
        return growth(currentCount, previousCount);
    }

    private long uniqueLocationsForMonth(List<ad_campaigns> campaigns, YearMonth month) {
        return campaigns.stream()
                .filter(this::hasTargetLocation)
                .filter(campaign -> YearMonth.from(resolveCampaignTimestamp(campaign).atZone(ZONE_ID)).equals(month))
                .map(campaign -> locationKey(campaign.getLocation()))
                .collect(Collectors.toSet())
                .size();
    }

    private double radiusGrowth(List<ad_campaigns> campaigns) {
        YearMonth current = YearMonth.now(ZONE_ID);
        YearMonth previous = current.minusMonths(1);
        double currentAvg = averageRadius(campaigns.stream()
                .filter(this::hasTargetLocation)
                .filter(campaign -> YearMonth.from(resolveCampaignTimestamp(campaign).atZone(ZONE_ID)).equals(current))
                .toList());
        double previousAvg = averageRadius(campaigns.stream()
                .filter(this::hasTargetLocation)
                .filter(campaign -> YearMonth.from(resolveCampaignTimestamp(campaign).atZone(ZONE_ID)).equals(previous))
                .toList());
        return growth(currentAvg, previousAvg);
    }

    private double publisherGrowth() {
        List<users> publishers = usersRepository.findAll();
        YearMonth current = YearMonth.now(ZONE_ID);
        YearMonth previous = current.minusMonths(1);
        long currentCount = publishers.stream()
                .map(users::getId)
                .map(this::parseObjectIdInstant)
                .filter(Objects::nonNull)
                .filter(instant -> YearMonth.from(instant.atZone(ZONE_ID)).equals(current))
                .count();
        long previousCount = publishers.stream()
                .map(users::getId)
                .map(this::parseObjectIdInstant)
                .filter(Objects::nonNull)
                .filter(instant -> YearMonth.from(instant.atZone(ZONE_ID)).equals(previous))
                .count();
        return growth(currentCount, previousCount);
    }

    private Instant resolveCampaignTimestamp(ad_campaigns campaign) {
        dateRange range = campaign.getDateRange();
        if (range != null && range.getFromDate() != null) {
            return range.getFromDate().toInstant();
        }
        Instant fromId = parseObjectIdInstant(campaign.getId());
        return fromId != null ? fromId : Instant.now();
    }

    private Instant parseObjectIdInstant(String id) {
        if (id == null || id.isBlank()) {
            return null;
        }
        try {
            return new ObjectId(id).getDate().toInstant();
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private long campaignDurationDays(ad_campaigns campaign) {
        dateRange range = campaign.getDateRange();
        if (range == null || range.getFromDate() == null || range.getToDate() == null) {
            return 0;
        }
        return Math.max(0, (range.getToDate().getTime() - range.getFromDate().getTime()) / (1000 * 60 * 60 * 24));
    }

    private String shortName(String fullName) {
        String[] parts = fullName.split(" ");
        return parts.length > 1 ? parts[0] + " " + parts[1].charAt(0) + "." : fullName;
    }

    private String shortId(String id) {
        return id.length() <= 6 ? id : id.substring(id.length() - 6);
    }

    private String formatPoint(txn_user_locations location) {
        return String.format(Locale.ENGLISH, "%.4f, %.4f", location.getLocation().getY(), location.getLocation().getX());
    }

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double earthRadiusKm = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    private double growth(double current, double previous) {
        if (previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return round(((current - previous) / previous) * 100.0);
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
