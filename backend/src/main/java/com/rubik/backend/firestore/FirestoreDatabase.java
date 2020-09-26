package com.rubik.backend.firestore;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class FirestoreDatabase {

    @Bean
    public Firestore getFirestore() throws IOException {
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance()
                        .toBuilder()
                        .setCredentials(ServiceAccountCredentials.fromStream(getClass().getClassLoader().getResourceAsStream("pogoda-24-7-service-account.json")))
                        .setProjectId("pogoda-24-7")
                        .build();
        return firestoreOptions.getService();
    }
}
