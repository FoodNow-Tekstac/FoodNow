package com.foodnow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent; 
import org.springframework.context.event.EventListener; 
import org.springframework.core.env.Environment; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling; 

@SpringBootApplication
@EnableScheduling // This enables the TaskScheduler for the 10-second delay

public class FoodNowApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodNowApplication.class, args);
    }

    @Autowired
    private Environment environment;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        String port = environment.getProperty("local.server.port");
        System.out.println("\n\n=========================================================");
        System.out.println("  Your FoodNow Frontend is live and ready!");
        System.out.println("  Access it here: http://localhost:" + port);
        System.out.println("=========================================================\n");
    }

}