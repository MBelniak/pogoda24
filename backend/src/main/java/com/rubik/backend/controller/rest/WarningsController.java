package com.rubik.backend.controller.rest;

import com.rubik.backend.dto.WarningAsPostDTO;
import com.rubik.backend.entity.Warning;
import com.rubik.backend.service.WarningsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/warnings")
public class WarningsController {
    private WarningsService warningsService;

    @Autowired
    public WarningsController(WarningsService warningsService) {
        this.warningsService = warningsService;
    }

    @GetMapping("/count")
    public Long getWarningssCount() {
        return warningsService.getWarningsCount();
    }

    @GetMapping("")
    public List<Warning> getWarnings(@RequestParam(required = false) Integer page,
                                     @RequestParam(required = false) Integer count) {
        if (page == null || count == null)
            return warningsService.getWarningsOrderedByDate();

        Page<Warning> warnings = warningsService.getWarningsOrderedByDate(page, count);
        return warnings.getContent();
    }

    @GetMapping("/dtos")
    public List<WarningAsPostDTO> getWarningsDTOs(@RequestParam(required = false) Integer page,
                                                  @RequestParam(required = false) Integer count) {
        List<Warning> warnings;
        if (page == null || count == null)
            warnings = warningsService.getWarningsOrderedByDate();
        else
            warnings = warningsService.getWarningsOrderedByDate(page, count).getContent();
        return warnings.stream().map(WarningAsPostDTO::new).collect(Collectors.toList());
    }

    @PostMapping("")
    public ResponseEntity<?> addWarning(@RequestBody @Valid Warning warning, BindingResult bindingResult) throws BindException {
        if (!bindingResult.hasErrors()) {
            warningsService.saveWarning(warning);
            warning = warningsService.getWarningById(warning.getId());
            if (warning != null) {
                return new ResponseEntity<>(warning, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw new BindException(bindingResult);
    }

    @PutMapping("")
    public void updateWarning(@RequestBody Warning warning) {
        if (warning != null) {
            warningsService.saveWarning(warning);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteWarning(@PathVariable Long id) {
        if (id != null) {
            warningsService.deleteWarning(id);
        }
    }
}
