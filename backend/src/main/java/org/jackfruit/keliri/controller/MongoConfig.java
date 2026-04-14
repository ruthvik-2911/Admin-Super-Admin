package org.jackfruit.keliri.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

@Component
@Configuration
public class MongoConfig {
	 @Bean
	    public MongoDatabase mongoDatabase() {
	       
	      
	    }
}
