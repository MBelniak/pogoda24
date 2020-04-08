package com.rubik.backend.service;

import com.rubik.backend.entity.Fact;
import com.rubik.backend.repository.FactsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FactsService {

    private FactsRepository factsRepository;

    @Autowired
    public FactsService(FactsRepository factsRepository) {
        this.factsRepository = factsRepository;
    }

    public List<Fact> getFactsOrderedByDate() {
        return factsRepository.findAll();
    }

    public Page<Fact> getFactsOrderedByDate(int page, int count) {
        Pageable pageable = PageRequest.of(page, count, Sort.by("postDate").descending());
        return factsRepository.findAll(pageable);
    }

    public Fact getFactById(Long id) {
        return factsRepository.findAllById(id);
    }

    public void saveFact(Fact fact) {
        factsRepository.saveAndFlush(fact);
    }

    public void deleteFact(Long id) {
        factsRepository.deleteById(id);
    }
}
