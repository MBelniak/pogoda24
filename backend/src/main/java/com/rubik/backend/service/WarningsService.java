package com.rubik.backend.service;

import com.rubik.backend.entity.Warning;
import com.rubik.backend.repository.WarningsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarningsService {
    private WarningsRepository warningsRepository;

    @Autowired
    public WarningsService(WarningsRepository warningsRepository) {
        this.warningsRepository = warningsRepository;
    }

    public List<Warning> getWarningsOrderedByDate() {
        return warningsRepository.findAll();
    }

    public Page<Warning> getWarningsOrderedByDate(int page, int count) {
        Pageable pageable = PageRequest.of(page, count, Sort.by("postDate").descending());
        return warningsRepository.findAll(pageable);
    }

    public Warning getWarningById(Long id) {
        return warningsRepository.findAllById(id);
    }

    public void saveWarning(Warning warning) {
        warningsRepository.saveAndFlush(warning);
    }

    public void deleteWarning(Long id) {
        warningsRepository.deleteById(id);
    }
}
