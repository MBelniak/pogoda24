package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.WarningInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequestMapping("api/warningInfo")
public interface WarningInfoController {

    @GetMapping(value = "/topBarWarning")
    WarningInfo getLatestWarningInfo();

    @Transactional
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<WarningInfo> addWarningInfo(@RequestBody @Valid WarningInfo warningInfo, BindingResult bindingResult) throws BindException;

    @Transactional
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<WarningInfo> updateWarningInfo(@RequestBody @Valid WarningInfo warningInfo, BindingResult bindingResult,
                                                  @RequestParam(required = false) Boolean temporary) throws BindException;

    @Transactional
    @GetMapping("/continueWarningInfoUpdate/{hash}")
    ResponseEntity continueWarningInfoUpdate(@PathVariable String hash, @RequestParam Boolean success);

    @Transactional
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    void deleteWarningInfo(@PathVariable Long id);

    @GetMapping("/byPostId/{id}")
    WarningInfo getWarning(@PathVariable Long id);
}
