package com.rubik.backend.firestore;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;

@Component
public class FirestoreDatabase {

    @Bean
    public Firestore getFirestore() throws IOException {
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance()
                        .toBuilder()
                        .setCredentials(GoogleCredentials.fromStream(new FileInputStream("MyFirstProject-b915277d3604.json")))
                        .build();
        return firestoreOptions.getService();
    }
}
