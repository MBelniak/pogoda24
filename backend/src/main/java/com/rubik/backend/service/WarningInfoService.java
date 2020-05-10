package com.rubik.backend.service;

import com.rubik.backend.entity.WarningInfo;
import com.rubik.backend.repository.WarningInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class WarningInfoService {

    private WarningInfoRepository warningInfoRepository;

    @Autowired
    public WarningInfoService(WarningInfoRepository warningInfoRepository) {
        this.warningInfoRepository = warningInfoRepository;
    }

    public List<WarningInfo> getCurrentWarnings() {
        return warningInfoRepository.findAllValidWarnings(new Timestamp(new Date().getTime()));
    }

    public void saveWarningInfo(WarningInfo warningInfo) {
        warningInfoRepository.saveAndFlush(warningInfo);
    }

    public void deleteWarningInfo(Long id) {
        warningInfoRepository.deleteById(id);
    }

    public WarningInfo getWarningInfoByPostId(Long postId) {
        return warningInfoRepository.findFirstByPostId(postId);
    }
}
