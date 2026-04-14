package org.jackfruit.keliri;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication

public class KeliriApplication extends SpringBootServletInitializer {//to support war file deployment. Spring Boot Servlet Initializer class file allows you to configure the application when it is launched by using Servlet Container.

	 @Override
	    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
	        return application.sources(KeliriApplication.class);
	    }
	
	public static void main(String[] args) {
		SpringApplication.run(KeliriApplication.class, args);
		System.out.println("Here we go");
		//extends SpringBootServletInitializer
	}

}
