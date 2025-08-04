package com.foodnow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent; // 1. Add this import
import org.springframework.context.event.EventListener; // 2. Add this import
import org.springframework.core.env.Environment; // 3. Add this import
import org.springframework.beans.factory.annotation.Autowired; // 4. Add this import
import org.springframework.scheduling.annotation.EnableScheduling; // ADD THIS ANNOTATION

@SpringBootApplication
@EnableScheduling // This enables the TaskScheduler for the 10-second delay

public class FoodNowApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodNowApplication.class, args);
    }

    // ===============================================================
    // 5. ADD THIS ENTIRE BLOCK OF CODE
    // ===============================================================
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
    // ===============================================================

}