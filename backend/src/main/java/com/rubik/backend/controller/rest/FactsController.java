package com.rubik.backend.controller.rest;

import com.rubik.backend.entity.Fact;
import com.rubik.backend.service.FactsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/facts")
public class FactsController {

    private FactsService factsService;

    @Autowired
    public FactsController(FactsService factsService) {
        this.factsService = factsService;
    }

    @GetMapping("")
    public List<Fact> getFacts(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer count) {
        if (page == null || count == null)
            return factsService.getFactsOrderedByDate();

        Page<Fact> facts = factsService.getFactsOrderedByDate(page, count);
        return facts.getContent();
    }

    @PostMapping("")
    public ResponseEntity<Object> addFact(@RequestBody Fact fact, BindingResult bindingResult) {
        if (!bindingResult.hasErrors()) {
            factsService.saveFact(fact);
            fact = factsService.getFactById(fact.getId());
            if (fact != null) {
                return new ResponseEntity<>(fact, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(bindingResult.getAllErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList()), HttpStatus.BAD_REQUEST);
    }

    @PutMapping("")
    public void updateFact(@RequestBody Fact fact) {
        if (fact != null) {
            factsService.saveFact(fact);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteFact(@PathVariable Long id) {
        if (id != null) {
            factsService.deleteFact(id);
        }
    }
}
