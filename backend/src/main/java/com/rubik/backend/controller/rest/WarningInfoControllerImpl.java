package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.Post;
import com.rubik.backend.entity.WarningInfo;
import com.rubik.backend.service.PostService;
import com.rubik.backend.service.WarningInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
public class WarningInfoControllerImpl implements WarningInfoController {

    private WarningInfoService warningInfoService;
    private PostService postService;
    private Map<String, WarningInfo> hashToWarningInfoMap;

    @Autowired
    public WarningInfoControllerImpl(WarningInfoService warningInfoService, PostService postService) {
        this.warningInfoService = warningInfoService;
        this.postService = postService;
        this.hashToWarningInfoMap = new ConcurrentHashMap<>();
    }

    @Override
    public WarningInfo getLatestWarningInfo() {
        List<WarningInfo> warningInfos = warningInfoService.getCurrentWarnings();
        if (warningInfos.size() == 0) {
            return null;
        }
        List<Post> posts = postService.getPostByIdIn(warningInfos.stream().map(WarningInfo::getPostId).collect(Collectors.toList()));
        posts.sort(Comparator.comparing(Post::getPostDate));
        return warningInfos.stream().filter(w -> w.getPostId().equals(posts.get(posts.size() - 1).getId())).collect(Collectors.toList()).get(0);
    }

    @Override
    public ResponseEntity<WarningInfo> addWarningInfo(@Valid WarningInfo warningInfo, BindingResult bindingResult) throws BindException {
        if (!bindingResult.hasErrors()) {
            warningInfoService.saveWarningInfo(warningInfo);
            return new ResponseEntity<>(warningInfo, HttpStatus.OK);
        }
        throw new BindException(bindingResult);
    }

    @Override
    public ResponseEntity updateWarningInfo(@RequestBody @Valid WarningInfo warningInfo, BindingResult bindingResult,
                                     @RequestParam(required = false) Boolean temporary) throws BindException {
        if (!bindingResult.hasErrors()) {
            if (temporary != null && temporary) {
                String pseudoHash = UUID.randomUUID().toString();
                while (hashToWarningInfoMap.get(pseudoHash) != null) {
                    pseudoHash = UUID.randomUUID().toString();
                }
                hashToWarningInfoMap.put(pseudoHash, warningInfo);
                return new ResponseEntity<>(pseudoHash, HttpStatus.OK);
            }
            warningInfoService.saveWarningInfo(warningInfo);
            return new ResponseEntity(HttpStatus.OK);
        } else {
            throw new BindException(bindingResult);
        }
    }

    @Override
    public ResponseEntity continueWarningInfoUpdate(@PathVariable String hash, @RequestParam Boolean success) {
        WarningInfo warningInfoToSave = hashToWarningInfoMap.get(hash);
        if (warningInfoToSave == null) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        if (success) {
            warningInfoService.saveWarningInfo(warningInfoToSave);
        }
        hashToWarningInfoMap.remove(hash);
        return new ResponseEntity(HttpStatus.OK);
    }

    @Override
    public void deleteWarningInfo(Long id) {
        warningInfoService.deleteWarningInfo(id);
    }

    @Override
    public WarningInfo getWarning(Long id) {
        return warningInfoService.getWarningInfoByPostId(id);
    }

}
