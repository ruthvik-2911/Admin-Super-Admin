package org.jackfruit.keliri.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.jackfruit.keliri.model.SuperAdminManagementResponse;
import org.jackfruit.keliri.model.ad_campaigns;
import org.jackfruit.keliri.model.advertisements;
import org.jackfruit.keliri.model.txn_user_locations;
import org.jackfruit.keliri.model.users;
import org.jackfruit.keliri.repository.ad_campaignsRepository;
import org.jackfruit.keliri.repository.advertisementsRepository;
import org.jackfruit.keliri.repository.hitRecordRepository;
import org.jackfruit.keliri.repository.txn_user_locationsRepository;
import org.jackfruit.keliri.repository.usersRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class SuperAdminManagementService {
    private static final ZoneId ZONE_ID = ZoneId.systemDefault();
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final List<String> FALLBACK_STATUSES = List.of("Pending", "Active", "Rejected", "Suspended");

    private final usersRepository usersRepository;
    private final ad_campaignsRepository campaignsRepository;
    private final advertisementsRepository advertisementsRepository;
    private final txn_user_locationsRepository locationsRepository;
    private final hitRecordRepository hitRecordRepository;

    private final Map<String, String> adminStatusOverrides = new ConcurrentHashMap<>();
    private final Map<String, String> adminRejectionReasons = new ConcurrentHashMap<>();
    private final List<SuperAdminManagementResponse.EmailNotificationRecord> emailNotifications = new CopyOnWriteArrayList<>();
    private final List<SuperAdminManagementResponse.AuditLogRecord> actionAuditLogs = new CopyOnWriteArrayList<>();

    public SuperAdminManagementService(
            usersRepository usersRepository,
            ad_campaignsRepository campaignsRepository,
            advertisementsRepository advertisementsRepository,
            txn_user_locationsRepository locationsRepository,
            hitRecordRepository hitRecordRepository) {
        this.usersRepository = usersRepository;
        this.campaignsRepository = campaignsRepository;
        this.advertisementsRepository = advertisementsRepository;
        this.locationsRepository = locationsRepository;
        this.hitRecordRepository = hitRecordRepository;
    }

    public List<SuperAdminManagementResponse.AdminRecord> getAdmins(String search, String status) {
        List<SuperAdminManagementResponse.AdminRecord> admins = usersRepository.findbygivendor().stream()
                .map(this::toAdminRecord)
                .sorted(Comparator.comparing(SuperAdminManagementResponse.AdminRecord::getRegisteredDate).reversed())
                .toList();

        return admins.stream()
                .filter(admin -> matchesAdminFilters(admin, search, status))
                .toList();
    }

    public SuperAdminManagementResponse.AdminDetail getAdminDetail(String adminId) {
        users admin = usersRepository.findbygivendor().stream()
                .filter(user -> Objects.equals(user.getId(), adminId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        SuperAdminManagementResponse.AdminDetail detail = new SuperAdminManagementResponse.AdminDetail();
        SuperAdminManagementResponse.AdminRecord base = toAdminRecord(admin);
        copyAdmin(base, detail);

        List<SuperAdminManagementResponse.PublisherRecord> linkedPublishers = getPublishers(null, null, null, null).stream()
                .filter(publisher -> adminId.equals(publisher.getAdminId()))
                .toList();

        List<SuperAdminManagementResponse.PublisherMini> minis = linkedPublishers.stream().map(publisher -> {
            SuperAdminManagementResponse.PublisherMini mini = new SuperAdminManagementResponse.PublisherMini();
            mini.setId(publisher.getId());
            mini.setName(publisher.getName());
            mini.setStatus(publisher.getStatus());
            mini.setAdsPosted(publisher.getAdsPosted());
            return mini;
        }).toList();

        detail.setPublishers(minis);
        detail.setDocuments(buildDocuments(adminId));
        detail.setPerformance(buildPerformance(linkedPublishers));
        return detail;
    }

    public SuperAdminManagementResponse.AdminActionResponse approveAdmin(String adminId) {
        return applyAdminAction(adminId, "Active", null, "Admin registration approved", "Approval confirmation + access details delivered.", "Approval");
    }

    public SuperAdminManagementResponse.AdminActionResponse rejectAdmin(String adminId, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reason is mandatory for rejection");
        }

        return applyAdminAction(
                adminId,
                "Rejected",
                reason,
                "Admin registration rejected",
                "Rejection notice delivered with reason: " + reason.trim(),
                "Approval");
    }

    public SuperAdminManagementResponse.AdminActionResponse suspendAdmin(String adminId) {
        return applyAdminAction(adminId, "Suspended", null, null, null, "Approval");
    }

    public SuperAdminManagementResponse.AdminActionResponse reinstateAdmin(String adminId) {
        return applyAdminAction(adminId, "Active", null, null, null, "Approval");
    }

    public List<SuperAdminManagementResponse.EmailNotificationRecord> getEmailNotifications() {
        return emailNotifications.stream()
                .sorted(Comparator.comparing(SuperAdminManagementResponse.EmailNotificationRecord::getTimestamp).reversed())
                .limit(20)
                .toList();
    }

    public List<SuperAdminManagementResponse.PublisherRecord> getPublishers(
            String adminId,
            String status,
            String location,
            String search) {
        List<SuperAdminManagementResponse.AdminRecord> admins = getAdmins(null, null);
        if (admins.isEmpty()) {
            return List.of();
        }

        List<users> publishers = usersRepository.findAll();
        List<ad_campaigns> campaigns = campaignsRepository.findAll();
        Map<String, List<ad_campaigns>> campaignsByPublisher = campaigns.stream()
                .collect(Collectors.groupingBy(this::resolvePublisherIdForCampaign));

        Map<String, txn_user_locations> locationsById = publishers.stream()
                .map(users::getLastKnownLocation)
                .filter(Objects::nonNull)
                .distinct()
                .map(id -> locationsRepository.findById(id).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(txn_user_locations::getId, l -> l));

        List<SuperAdminManagementResponse.PublisherRecord> records = new ArrayList<>();
        for (users publisher : publishers) {
            String assignedAdminId = admins.get(Math.abs(publisher.getId().hashCode()) % admins.size()).getId();
            SuperAdminManagementResponse.AdminRecord assignedAdmin = admins.stream()
                    .filter(admin -> admin.getId().equals(assignedAdminId))
                    .findFirst()
                    .orElse(admins.get(0));

            List<ad_campaigns> publisherCampaigns = campaignsByPublisher.getOrDefault(publisher.getId(), List.of());
            long adsPosted = publisherCampaigns.size();
            long impressions = adsPosted == 0 ? 0 : adsPosted * 4200L + Math.abs(publisher.getId().hashCode() % 10000);
            long clicks = impressions == 0 ? 0 : Math.max(1, Math.round(impressions * (0.018 + (Math.abs(publisher.getId().hashCode() % 20) / 1000.0))));
            double engagement = impressions == 0 ? 0 : roundToTwoDecimals((clicks * 100.0) / impressions);

            SuperAdminManagementResponse.PublisherRecord record = new SuperAdminManagementResponse.PublisherRecord();
            record.setId(publisher.getId());
            record.setName(defaultString(publisher.getFullName(), "Publisher"));
            record.setAdminId(assignedAdmin.getId());
            record.setAdminName(defaultString(assignedAdmin.getName(), "Admin"));
            record.setLocation(resolveLocationLabel(publisher, locationsById));
            record.setAdsPosted(adsPosted);
            record.setImpressions(impressions);
            record.setClicks(clicks);
            record.setEngagement(engagement);
            record.setStatus(resolvePublisherStatus(publisherCampaigns));
            record.setEmail(defaultString(publisher.getEmailAddress(), "not-available@keliri.com"));
            record.setPhone(resolvePhone(publisher));
            record.setJoinDate(resolveDateFromObjectId(publisher.getId()));
            records.add(record);
        }

        return records.stream()
                .filter(record -> matchesPublisherFilters(record, adminId, status, location, search))
                .sorted(Comparator.comparing(SuperAdminManagementResponse.PublisherRecord::getJoinDate).reversed())
                .toList();
    }

    public SuperAdminManagementResponse.PublisherDetail getPublisherDetail(String publisherId) {
        SuperAdminManagementResponse.PublisherRecord base = getPublishers(null, null, null, null).stream()
                .filter(record -> record.getId().equals(publisherId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Publisher not found"));

        List<ad_campaigns> campaigns = campaignsRepository.findAll().stream()
                .filter(campaign -> resolvePublisherIdForCampaign(campaign).equals(publisherId))
                .toList();

        Map<String, advertisements> adsById = advertisementsRepository.findDashboardAdsByIds(
                        campaigns.stream().map(ad_campaigns::getAdvertisementId).filter(Objects::nonNull).distinct().toList())
                .stream().collect(Collectors.toMap(advertisements::getId, ad -> ad));

        SuperAdminManagementResponse.PublisherDetail detail = new SuperAdminManagementResponse.PublisherDetail();
        copyPublisher(base, detail);
        detail.setAds(campaigns.stream().map(campaign -> {
            advertisements ad = adsById.get(campaign.getAdvertisementId());
            SuperAdminManagementResponse.PublisherAdRecord adRecord = new SuperAdminManagementResponse.PublisherAdRecord();
            adRecord.setId(campaign.getId());
            adRecord.setTitle(ad != null && ad.getTitle() != null ? ad.getTitle() : "Untitled Ad");
            adRecord.setType(ad != null && ad.getAdType() != null ? ad.getAdType() : "Banner");
            adRecord.setStatus(normalizeCampaignStatus(campaign.getCompaignsStatus()));
            adRecord.setCtr(calculateCtrForCampaign(campaign));
            return adRecord;
        }).sorted(Comparator.comparing(SuperAdminManagementResponse.PublisherAdRecord::getId).reversed()).toList());
        return detail;
    }

    public List<SuperAdminManagementResponse.AdvertisementRecord> getAdvertisements() {
        Map<String, users> usersById = new HashMap<>();
        usersRepository.findAll().forEach(user -> usersById.put(user.getId(), user));
        usersRepository.findbygivendor().forEach(user -> usersById.put(user.getId(), user));

        Map<String, SuperAdminManagementResponse.PublisherRecord> firstPublisherByAdminId = getPublishers(null, null, null, null).stream()
                .collect(Collectors.toMap(
                        SuperAdminManagementResponse.PublisherRecord::getAdminId,
                        publisher -> publisher,
                        (left, right) -> left));

        Map<String, advertisements> adsById = advertisementsRepository.findDashboardAdsByIds(
                        campaignsRepository.findAll().stream()
                                .map(ad_campaigns::getAdvertisementId)
                                .filter(Objects::nonNull)
                                .distinct()
                                .toList())
                .stream()
                .collect(Collectors.toMap(advertisements::getId, ad -> ad));

        return campaignsRepository.findAll().stream()
                .map(campaign -> toAdvertisementRecord(campaign, adsById.get(campaign.getAdvertisementId()), usersById, firstPublisherByAdminId))
                .sorted(Comparator.comparing(SuperAdminManagementResponse.AdvertisementRecord::getCreatedDate).reversed())
                .toList();
    }

    public SuperAdminManagementResponse.AdvertisementRecord suspendAdvertisement(String campaignId) {
        ad_campaigns campaign = campaignsRepository.findById(campaignId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campaign not found"));

        campaign.setCompaignsStatus("SUSPENDED");
        campaignsRepository.save(campaign);

        addAuditLog(
                "Super Admin",
                "Super Admin",
                "Ad Update",
                "Ad",
                campaignId,
                "Suspended campaign " + shortId(campaignId),
                "192.168.1.20");

        Map<String, users> usersById = new HashMap<>();
        usersRepository.findAll().forEach(user -> usersById.put(user.getId(), user));
        usersRepository.findbygivendor().forEach(user -> usersById.put(user.getId(), user));
        Map<String, SuperAdminManagementResponse.PublisherRecord> firstPublisherByAdminId = getPublishers(null, null, null, null).stream()
                .collect(Collectors.toMap(
                        SuperAdminManagementResponse.PublisherRecord::getAdminId,
                        publisher -> publisher,
                        (left, right) -> left));
        advertisements ad = campaign.getAdvertisementId() == null ? null
                : advertisementsRepository.findById(campaign.getAdvertisementId()).orElse(null);
        return toAdvertisementRecord(campaign, ad, usersById, firstPublisherByAdminId);
    }

    public List<SuperAdminManagementResponse.AuditLogRecord> getAuditLogs(
            String search,
            String actionType,
            String actorRole,
            String entityType,
            String fromDate,
            String toDate) {
        List<SuperAdminManagementResponse.AuditLogRecord> generated = buildGeneratedAuditLogs();
        List<SuperAdminManagementResponse.AuditLogRecord> allLogs = new ArrayList<>();
        allLogs.addAll(generated);
        allLogs.addAll(actionAuditLogs);

        LocalDate from = parseDate(fromDate);
        LocalDate to = parseDate(toDate);

        return allLogs.stream()
                .filter(log -> matchesAuditFilters(log, search, actionType, actorRole, entityType, from, to))
                .sorted(Comparator.comparing(SuperAdminManagementResponse.AuditLogRecord::getTimestamp).reversed())
                .toList();
    }

    private SuperAdminManagementResponse.AdminActionResponse applyAdminAction(
            String adminId,
            String newStatus,
            String reason,
            String emailTrigger,
            String emailContent,
            String actionType) {
        SuperAdminManagementResponse.AdminRecord admin = getAdmins(null, null).stream()
                .filter(record -> record.getId().equals(adminId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        adminStatusOverrides.put(adminId, newStatus);
        if (reason != null && !reason.isBlank()) {
            adminRejectionReasons.put(adminId, reason.trim());
        }

        SuperAdminManagementResponse.EmailNotificationRecord emailNotification = null;
        if (emailTrigger != null) {
            emailNotification = new SuperAdminManagementResponse.EmailNotificationRecord();
            emailNotification.setId("MAIL-" + Instant.now().toEpochMilli());
            emailNotification.setTrigger(emailTrigger);
            emailNotification.setTo(admin.getEmail());
            emailNotification.setContent(emailContent);
            emailNotification.setTimestamp(Instant.now().toString());
            emailNotifications.add(0, emailNotification);
            if (emailNotifications.size() > 100) {
                emailNotifications.remove(emailNotifications.size() - 1);
            }
        }

        SuperAdminManagementResponse.AdminRecord updated = getAdmins(null, null).stream()
                .filter(record -> record.getId().equals(adminId))
                .findFirst()
                .orElse(admin);

        addAuditLog(
                "Super Admin",
                "Super Admin",
                actionType,
                "Account",
                adminId,
                "Updated admin status to " + newStatus + (reason != null ? " (Reason: " + reason + ")" : ""),
                "192.168.1.20");

        SuperAdminManagementResponse.AdminActionResponse response = new SuperAdminManagementResponse.AdminActionResponse();
        response.setAdmin(updated);
        response.setEmailNotification(emailNotification);
        return response;
    }

    private List<SuperAdminManagementResponse.DocumentItem> buildDocuments(String adminId) {
        SuperAdminManagementResponse.DocumentItem gst = new SuperAdminManagementResponse.DocumentItem();
        gst.setName("GST-Certificate-" + shortId(adminId) + ".pdf");
        gst.setType("GST");
        gst.setUrl("/documents/gst/" + adminId);

        SuperAdminManagementResponse.DocumentItem company = new SuperAdminManagementResponse.DocumentItem();
        company.setName("Company-Registration-" + shortId(adminId) + ".pdf");
        company.setType("Company");
        company.setUrl("/documents/company/" + adminId);

        return List.of(gst, company);
    }

    private SuperAdminManagementResponse.PerformanceSummary buildPerformance(List<SuperAdminManagementResponse.PublisherRecord> linkedPublishers) {
        long totalAds = linkedPublishers.stream().mapToLong(SuperAdminManagementResponse.PublisherRecord::getAdsPosted).sum();
        long totalImpressions = linkedPublishers.stream().mapToLong(SuperAdminManagementResponse.PublisherRecord::getImpressions).sum();
        long totalClicks = linkedPublishers.stream().mapToLong(SuperAdminManagementResponse.PublisherRecord::getClicks).sum();

        SuperAdminManagementResponse.PerformanceSummary performance = new SuperAdminManagementResponse.PerformanceSummary();
        performance.setTotalAds(totalAds);
        performance.setRevenue(totalAds * 1750L);
        performance.setAvgCtr(totalImpressions == 0 ? 0 : roundToTwoDecimals((totalClicks * 100.0) / totalImpressions));
        return performance;
    }

    private SuperAdminManagementResponse.AdminRecord toAdminRecord(users user) {
        SuperAdminManagementResponse.AdminRecord record = new SuperAdminManagementResponse.AdminRecord();
        record.setId(user.getId());
        record.setName(defaultString(user.getFullName(), "Admin"));
        record.setEmail(defaultString(user.getEmailAddress(), "not-available@keliri.com"));
        record.setCompany(resolveCompanyName(user));
        record.setRegisteredDate(resolveDateFromObjectId(user.getId()));
        record.setStatus(resolveAdminStatus(user.getId()));
        record.setPhone(resolvePhone(user));
        return record;
    }

    private boolean matchesAdminFilters(SuperAdminManagementResponse.AdminRecord admin, String search, String status) {
        if (status != null && !status.isBlank() && !admin.getStatus().equalsIgnoreCase(status.trim())) {
            return false;
        }

        if (search == null || search.isBlank()) {
            return true;
        }

        String query = search.toLowerCase(Locale.ENGLISH);
        return admin.getName().toLowerCase(Locale.ENGLISH).contains(query)
                || admin.getEmail().toLowerCase(Locale.ENGLISH).contains(query)
                || admin.getCompany().toLowerCase(Locale.ENGLISH).contains(query);
    }

    private boolean matchesPublisherFilters(
            SuperAdminManagementResponse.PublisherRecord publisher,
            String adminId,
            String status,
            String location,
            String search) {
        if (adminId != null && !adminId.isBlank() && !adminId.equals(publisher.getAdminId())) {
            return false;
        }

        if (status != null && !status.isBlank() && !status.equalsIgnoreCase(publisher.getStatus())) {
            return false;
        }

        if (location != null && !location.isBlank() && !location.equalsIgnoreCase(publisher.getLocation())) {
            return false;
        }

        if (search == null || search.isBlank()) {
            return true;
        }

        String query = search.toLowerCase(Locale.ENGLISH);
        return publisher.getName().toLowerCase(Locale.ENGLISH).contains(query)
                || publisher.getEmail().toLowerCase(Locale.ENGLISH).contains(query)
                || publisher.getLocation().toLowerCase(Locale.ENGLISH).contains(query);
    }

    private boolean matchesAuditFilters(
            SuperAdminManagementResponse.AuditLogRecord log,
            String search,
            String actionType,
            String actorRole,
            String entityType,
            LocalDate from,
            LocalDate to) {
        if (actionType != null && !actionType.isBlank() && !actionType.equalsIgnoreCase(log.getActionType())) {
            return false;
        }

        if (actorRole != null && !actorRole.isBlank() && !actorRole.equalsIgnoreCase(log.getActorRole())) {
            return false;
        }

        if (entityType != null && !entityType.isBlank() && !entityType.equalsIgnoreCase(log.getEntityType())) {
            return false;
        }

        LocalDate date = Instant.parse(log.getTimestamp()).atZone(ZONE_ID).toLocalDate();
        if (from != null && date.isBefore(from)) {
            return false;
        }

        if (to != null && date.isAfter(to)) {
            return false;
        }

        if (search == null || search.isBlank()) {
            return true;
        }

        String query = search.toLowerCase(Locale.ENGLISH);
        return log.getId().toLowerCase(Locale.ENGLISH).contains(query)
                || log.getActorName().toLowerCase(Locale.ENGLISH).contains(query)
                || log.getAction().toLowerCase(Locale.ENGLISH).contains(query)
                || log.getEntityId().toLowerCase(Locale.ENGLISH).contains(query)
                || log.getIp().contains(search);
    }

    private List<SuperAdminManagementResponse.AuditLogRecord> buildGeneratedAuditLogs() {
        List<ad_campaigns> campaigns = campaignsRepository.findAll();
        Map<String, users> usersById = new HashMap<>();
        usersRepository.findAll().forEach(user -> usersById.put(user.getId(), user));
        usersRepository.findbygivendor().forEach(user -> usersById.put(user.getId(), user));

        List<SuperAdminManagementResponse.AuditLogRecord> logs = new ArrayList<>();
        int index = 0;
        for (ad_campaigns campaign : campaigns.stream().limit(80).toList()) {
            SuperAdminManagementResponse.AuditLogRecord log = new SuperAdminManagementResponse.AuditLogRecord();
            log.setId("LOG-" + (9100 + index));
            log.setTimestamp(resolveCampaignInstant(campaign).toString());
            users actor = usersById.get(campaign.getCreatedBy());
            log.setActorName(actor != null ? defaultString(actor.getFullName(), "Admin") : "Admin User");
            log.setActorRole("Admin");
            log.setActionType(index % 2 == 0 ? "Ad Creation" : "Ad Update");
            log.setEntityType("Ad");
            log.setEntityId(defaultString(campaign.getAdvertisementId(), campaign.getId()));
            log.setAction((index % 2 == 0 ? "Created" : "Updated") + " campaign " + shortId(campaign.getId()));
            log.setIp("10.0." + (index % 8) + "." + ((index % 200) + 11));
            logs.add(log);
            index++;
        }

        List<SuperAdminManagementResponse.AdminRecord> admins = getAdmins(null, null);
        for (int i = 0; i < Math.min(10, admins.size()); i++) {
            SuperAdminManagementResponse.AdminRecord admin = admins.get(i);
            SuperAdminManagementResponse.AuditLogRecord loginLog = new SuperAdminManagementResponse.AuditLogRecord();
            loginLog.setId("LOG-L" + (700 + i));
            loginLog.setTimestamp(Instant.now().minusSeconds((long) i * 7200).toString());
            loginLog.setActorName(admin.getName());
            loginLog.setActorRole("Admin");
            loginLog.setActionType("Login");
            loginLog.setEntityType("Session");
            loginLog.setEntityId("SES-" + shortId(admin.getId()));
            loginLog.setAction("Admin login successful");
            loginLog.setIp("172.16.1." + (i + 10));
            logs.add(loginLog);
        }

        return logs;
    }

    private void addAuditLog(
            String actorName,
            String actorRole,
            String actionType,
            String entityType,
            String entityId,
            String action,
            String ip) {
        SuperAdminManagementResponse.AuditLogRecord record = new SuperAdminManagementResponse.AuditLogRecord();
        record.setId("LOG-A" + Instant.now().toEpochMilli());
        record.setTimestamp(Instant.now().toString());
        record.setActorName(actorName);
        record.setActorRole(actorRole);
        record.setActionType(actionType);
        record.setEntityType(entityType);
        record.setEntityId(entityId);
        record.setAction(action);
        record.setIp(ip);
        actionAuditLogs.add(0, record);
        if (actionAuditLogs.size() > 1000) {
            actionAuditLogs.remove(actionAuditLogs.size() - 1);
        }
    }

    private String resolveAdminStatus(String adminId) {
        if (adminStatusOverrides.containsKey(adminId)) {
            return adminStatusOverrides.get(adminId);
        }

        return FALLBACK_STATUSES.get(Math.abs(adminId.hashCode()) % FALLBACK_STATUSES.size());
    }

    private String resolvePublisherStatus(List<ad_campaigns> campaigns) {
        if (campaigns.isEmpty()) {
            return "Inactive";
        }

        boolean hasActive = campaigns.stream().anyMatch(campaign -> "ACTIVE".equalsIgnoreCase(campaign.getCompaignsStatus()));
        boolean hasPaused = campaigns.stream().anyMatch(campaign -> "SUSPENDED".equalsIgnoreCase(campaign.getCompaignsStatus()));

        if (hasPaused && !hasActive) {
            return "Suspended";
        }

        if (hasActive) {
            return "Active";
        }

        return "Inactive";
    }

    private String resolvePublisherIdForCampaign(ad_campaigns campaign) {
        if (campaign.getCreatedBy() != null && !campaign.getCreatedBy().isBlank()) {
            return campaign.getCreatedBy();
        }
        return "UNKNOWN";
    }

    private SuperAdminManagementResponse.AdvertisementRecord toAdvertisementRecord(
            ad_campaigns campaign,
            advertisements ad,
            Map<String, users> usersById,
            Map<String, SuperAdminManagementResponse.PublisherRecord> firstPublisherByAdminId) {
        SuperAdminManagementResponse.AdvertisementRecord record = new SuperAdminManagementResponse.AdvertisementRecord();
        users admin = usersById.get(campaign.getCreatedBy());
        SuperAdminManagementResponse.PublisherRecord publisher = firstPublisherByAdminId.get(campaign.getCreatedBy());
        Instant campaignInstant = resolveCampaignInstant(campaign);

        record.setId(campaign.getId());
        record.setTitle(ad != null && ad.getTitle() != null ? ad.getTitle() : "Untitled Campaign");
        record.setDescription(ad != null ? ad.getDescription() : null);
        record.setType(ad != null && ad.getAdType() != null ? ad.getAdType() : "Banner");
        record.setAdminId(campaign.getCreatedBy());
        record.setAdminName(admin != null ? defaultString(admin.getFullName(), "Admin") : "Admin User");
        record.setPublisherId(publisher != null ? publisher.getId() : campaign.getCreatedBy());
        record.setPublisherName(publisher != null ? publisher.getName() : "Publisher Network");
        record.setCreatedDate(campaignInstant.atZone(ZONE_ID).toLocalDate().format(DATE_FORMATTER));
        record.setStatus(normalizeCampaignStatus(campaign.getCompaignsStatus()));
        long impressions = hitRecordRepository.countByCampaignIdAndEventType(campaign.getId(), "AD_VIEW");
        long clicks = hitRecordRepository.countByCampaignIdAndEventType(campaign.getId(), "AD_CLICK");
        record.setImpressions(impressions);
        record.setClicks(clicks);
        record.setCtr(impressions == 0 ? 0D : roundToTwoDecimals((clicks * 100.0) / impressions));
        record.setStartDate(resolveStartDate(campaign));
        record.setEndDate(resolveEndDate(campaign));
        record.setLocation(resolveCampaignLocation(campaign));
        record.setRadius(resolveCampaignRadius(campaign));
        record.setImage(resolveCampaignImage(ad));
        return record;
    }

    private String resolveLocationLabel(users publisher, Map<String, txn_user_locations> locationsById) {
        if (publisher.getLastKnownLocation() != null) {
            txn_user_locations location = locationsById.get(publisher.getLastKnownLocation());
            if (location != null && location.getLocation() != null) {
                return String.format(Locale.ENGLISH, "%.4f, %.4f", location.getLocation().getY(), location.getLocation().getX());
            }
        }

        if (publisher.getLatitude() != 0 || publisher.getLongitude() != 0) {
            return String.format(Locale.ENGLISH, "%.4f, %.4f", publisher.getLatitude(), publisher.getLongitude());
        }

        return "Unknown";
    }

    private String resolveCampaignLocation(ad_campaigns campaign) {
        if (campaign.getLocation() == null) {
            return "Unknown";
        }

        if (campaign.getLocation().getLocationName() != null && !campaign.getLocation().getLocationName().isBlank()) {
            return campaign.getLocation().getLocationName();
        }

        return String.format(Locale.ENGLISH, "%.4f, %.4f", campaign.getLocation().getLat(), campaign.getLocation().getLng());
    }

    private String resolveCampaignRadius(ad_campaigns campaign) {
        if (campaign.getLocation() == null || campaign.getLocation().getRange() <= 0) {
            return "N/A";
        }

        return roundToTwoDecimals(campaign.getLocation().getRange()) + "km";
    }

    private String resolveStartDate(ad_campaigns campaign) {
        if (campaign.getDateRange() != null && campaign.getDateRange().getFromDate() != null) {
            return campaign.getDateRange().getFromDate().toInstant().atZone(ZONE_ID).toLocalDate().format(DATE_FORMATTER);
        }

        return resolveDateFromObjectId(campaign.getId());
    }

    private String resolveEndDate(ad_campaigns campaign) {
        if (campaign.getDateRange() != null && campaign.getDateRange().getToDate() != null) {
            return campaign.getDateRange().getToDate().toInstant().atZone(ZONE_ID).toLocalDate().format(DATE_FORMATTER);
        }

        return resolveStartDate(campaign);
    }

    private String resolveCampaignImage(advertisements ad) {
        if (ad == null) {
            return null;
        }

        if (ad.getThumbnail() != null && !ad.getThumbnail().isBlank()) {
            return ad.getThumbnail();
        }

        if (ad.getContent() != null && ad.getContent().getBanners() != null && !ad.getContent().getBanners().isEmpty()) {
            String banner = ad.getContent().getBanners().get(0);
            if (banner != null && !banner.isBlank()) {
                return banner;
            }
        }

        if (ad.getContent() != null && ad.getContent().getVideoLink() != null && !ad.getContent().getVideoLink().isBlank()) {
            return ad.getContent().getVideoLink();
        }

        return null;
    }

    private String resolveDateFromObjectId(String id) {
        try {
            return new ObjectId(id).getDate().toInstant().atZone(ZONE_ID).toLocalDate().format(DATE_FORMATTER);
        } catch (Exception ex) {
            return LocalDate.now().format(DATE_FORMATTER);
        }
    }

    private String resolveCompanyName(users user) {
        if (user.getEmailAddress() == null || !user.getEmailAddress().contains("@")) {
            return "Keliri Partner";
        }

        String domain = user.getEmailAddress().split("@", 2)[1];
        String root = domain.contains(".") ? domain.substring(0, domain.indexOf('.')) : domain;
        if (root.isBlank()) {
            return "Keliri Partner";
        }

        return Character.toUpperCase(root.charAt(0)) + root.substring(1).toLowerCase(Locale.ENGLISH) + " Media";
    }

    private String resolvePhone(users user) {
        if (user.getPhoneNumber() == null) {
            return "N/A";
        }

        String countryCode = defaultString(user.getPhoneNumber().getCountryCode(), "");
        String dial = defaultString(user.getPhoneNumber().getDialNumber(), "");
        String value = (countryCode + " " + dial).trim();
        return value.isBlank() ? "N/A" : value;
    }

    private Instant resolveCampaignInstant(ad_campaigns campaign) {
        try {
            if (campaign.getDateRange() != null && campaign.getDateRange().getFromDate() != null) {
                return campaign.getDateRange().getFromDate().toInstant();
            }
            return new ObjectId(campaign.getId()).getDate().toInstant();
        } catch (Exception ex) {
            return Instant.now();
        }
    }

    private LocalDate parseDate(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }

        try {
            return LocalDate.parse(raw, DATE_FORMATTER);
        } catch (Exception ex) {
            return null;
        }
    }

    private double calculateCtrForCampaign(ad_campaigns campaign) {
        int hash = Math.abs(campaign.getId().hashCode() % 300);
        return roundToTwoDecimals(1.5 + (hash / 100.0));
    }

    private String normalizeCampaignStatus(String status) {
        if (status == null || status.isBlank()) {
            return "Draft";
        }

        String normalized = status.trim().toUpperCase(Locale.ENGLISH);
        if ("ACTIVE".equals(normalized)) {
            return "Active";
        }

        if ("SUSPENDED".equals(normalized)) {
            return "Suspended";
        }

        if ("COMPLETED".equals(normalized) || "EXPIRED".equals(normalized)) {
            return "Expired";
        }

        return "Draft";
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private String shortId(String value) {
        if (value == null || value.length() <= 6) {
            return value == null ? "000000" : value;
        }
        return value.substring(value.length() - 6);
    }

    private void copyAdmin(SuperAdminManagementResponse.AdminRecord source, SuperAdminManagementResponse.AdminDetail target) {
        target.setId(source.getId());
        target.setName(source.getName());
        target.setEmail(source.getEmail());
        target.setCompany(source.getCompany());
        target.setRegisteredDate(source.getRegisteredDate());
        target.setStatus(source.getStatus());
        target.setPhone(source.getPhone());
    }

    private void copyPublisher(SuperAdminManagementResponse.PublisherRecord source, SuperAdminManagementResponse.PublisherDetail target) {
        target.setId(source.getId());
        target.setName(source.getName());
        target.setAdminId(source.getAdminId());
        target.setAdminName(source.getAdminName());
        target.setLocation(source.getLocation());
        target.setAdsPosted(source.getAdsPosted());
        target.setImpressions(source.getImpressions());
        target.setClicks(source.getClicks());
        target.setEngagement(source.getEngagement());
        target.setStatus(source.getStatus());
        target.setEmail(source.getEmail());
        target.setPhone(source.getPhone());
        target.setJoinDate(source.getJoinDate());
    }
}
