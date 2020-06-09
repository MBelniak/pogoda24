package com.rubik.backend.firestore;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URISyntaxException;

@Component
public class FirestoreDatabase {

    @Bean
    public Firestore getFirestore() throws IOException {
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance()
                        .toBuilder()
                        .setCredentials(ServiceAccountCredentials.fromStream(getClass().getClassLoader().getResourceAsStream("MyFirstProject-b915277d3604.json")))
                        .setProjectId("orbital-voyage-235912")
                        .build();
        return firestoreOptions.getService();
    }
}
