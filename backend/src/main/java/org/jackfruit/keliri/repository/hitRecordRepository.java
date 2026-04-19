package org.jackfruit.keliri.repository;

import org.bson.types.ObjectId;
import org.jackfruit.keliri.model.hitRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface hitRecordRepository extends MongoRepository<hitRecord, ObjectId>{
    long countByCampaignIdAndEventType(String campaignId, String eventType);
    List<hitRecord> findByCampaignIdInAndTimestampAfter(List<String> campaignIds, Date timestamp);
    List<hitRecord> findByCampaignIdInAndTimestampBetween(List<String> campaignIds, Date startDate, Date endDate);
}
