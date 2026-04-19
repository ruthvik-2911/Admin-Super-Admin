package org.jackfruit.keliri.service;

import org.jackfruit.keliri.model.AdminDashboardResponse;
import org.jackfruit.keliri.model.ad_campaigns;
import org.jackfruit.keliri.model.hitRecord;
import org.jackfruit.keliri.repository.PublisherRepository;
import org.jackfruit.keliri.repository.ad_campaignsRepository;
import org.jackfruit.keliri.repository.hitRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    @Autowired
    private ad_campaignsRepository campaignsRepository;

    @Autowired
    private hitRecordRepository hitRecordRepository;

    @Autowired
    private PublisherRepository publisherRepository;

    private static final ZoneId ZONE_ID = ZoneId.systemDefault();
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    public AdminDashboardResponse getDashboardData(String adminId) {
        
        // 1. Fetch related ad campaigns
        List<ad_campaigns> campaigns = campaignsRepository.findByCreatedBy(adminId);
        List<String> campaignIds = campaigns.stream()
                .map(ad_campaigns::getId)
                .collect(Collectors.toList());

        // 2. Fetch hit records for 30 days
        Instant thirtyDaysAgoInstant = Instant.now().minus(30, ChronoUnit.DAYS);
        Date thirtyDaysAgoDate = Date.from(thirtyDaysAgoInstant);

        List<hitRecord> hits = new ArrayList<>();
        if (!campaignIds.isEmpty()) {
            hits = hitRecordRepository.findByCampaignIdInAndTimestampAfter(campaignIds, thirtyDaysAgoDate);
        }

        // 3. Compute KPIs
        long totalAds = campaigns.size();
        long activeAds = campaigns.stream().filter(c -> "ACTIVE".equalsIgnoreCase(c.getCompaignsStatus())).count();
        long expiredAds = campaigns.stream().filter(c -> "EXPIRED".equalsIgnoreCase(c.getCompaignsStatus())).count();
        long totalPublishers = publisherRepository.findByAdminId(adminId).size();
        
        // Using Super Admin conversion ratio for spend mock computation
        long totalSpend = totalAds * 1750L; 
        
        long totalClicks = hits.stream().filter(h -> "AD_CLICK".equalsIgnoreCase(h.getEventType())).count();

        // 4. Group chart data
        Map<String, AdminDashboardResponse.ChartData> dayDataMap = new LinkedHashMap<>();
        
        // Initialize last 30 days
        LocalDate today = LocalDate.now(ZONE_ID);
        for (int i = 29; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            String dateStr = d.format(DATE_FORMATTER);
            AdminDashboardResponse.ChartData chartData = new AdminDashboardResponse.ChartData();
            chartData.setDate(dateStr);
            chartData.setClicks(0);
            chartData.setImpressions(0);
            chartData.setSpend(0);
            dayDataMap.put(dateStr, chartData);
        }

        // Map hits over timeline
        for (hitRecord hit : hits) {
            String hitDate = hit.getTimestamp().toInstant().atZone(ZONE_ID).toLocalDate().format(DATE_FORMATTER);
            if (dayDataMap.containsKey(hitDate)) {
                AdminDashboardResponse.ChartData dayData = dayDataMap.get(hitDate);
                if ("AD_CLICK".equalsIgnoreCase(hit.getEventType())) {
                    dayData.setClicks(dayData.getClicks() + 1);
                } else if ("AD_VIEW".equalsIgnoreCase(hit.getEventType())) {
                    dayData.setImpressions(dayData.getImpressions() + 1);
                }
            }
        }
        
        // Calculate historical spend. (Mock logic: distributed evenly or randomly mapped over impressions. Let's base it on impressions * factor for visual dynamic graph realism)
        for (AdminDashboardResponse.ChartData dayData : dayDataMap.values()) {
            if (dayData.getImpressions() > 0) {
                 long dailySpend = Math.round((dayData.getImpressions() * 1.5) + (dayData.getClicks() * 5));
                 dayData.setSpend(dailySpend);
            }
        }

        List<AdminDashboardResponse.ChartData> allCharts = new ArrayList<>(dayDataMap.values());

        // 5. Construct Response
        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalAds(totalAds);
        response.setActiveAds(activeAds);
        response.setExpiredAds(expiredAds);
        response.setTotalPublishers(totalPublishers);
        response.setTotalSpend(totalSpend);
        response.setTotalClicks(totalClicks);
        
        response.setPerformanceTrend(allCharts);
        response.setEngagementTrend(allCharts);
        response.setSpendVsPerformance(allCharts);

        return response;
    }
}
