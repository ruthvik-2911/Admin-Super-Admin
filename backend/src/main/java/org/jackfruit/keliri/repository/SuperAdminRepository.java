package org.jackfruit.keliri.repository;

import org.jackfruit.keliri.model.SuperAdmin;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SuperAdminRepository extends MongoRepository<SuperAdmin, String> {
    Optional<SuperAdmin> findByEmail(String email);
}