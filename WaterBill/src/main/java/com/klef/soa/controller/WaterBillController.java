package com.klef.soa.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.entity.WaterBill;
import com.klef.soa.service.WaterBillService;

@RestController
@RequestMapping("/waterbill")
@CrossOrigin(origins = {"http://localhost:3004", "http://localhost:5173"})
public class WaterBillController {
	
	@Autowired
	private WaterBillService service;
	
	@GetMapping("/")
	public String waterbill() {
		return "WaterBill Service Project";
	}
	
	@PostMapping("/add")
	public ResponseEntity<WaterBill> addWaterBill(@RequestBody WaterBill wb) {
		WaterBill waterbill = service.addWaterBill(wb);
		return ResponseEntity.status(201).body(waterbill);
	}
	
	@GetMapping("/displayall")
	public ResponseEntity<List<WaterBill>> displayAll() {
		List<WaterBill> waterbills =service.displayAllWaterBills();
		return ResponseEntity.status(200).body(waterbills);
	}
	
	@GetMapping("/display/{id}")
	public ResponseEntity<?> displayByWaterBillId(@PathVariable Long id) {
		WaterBill waterbill = service.displayWaterBillById(id);
		if(waterbill != null) {
			return ResponseEntity.status(200).body(waterbill);
			
		}
		else{
			return ResponseEntity.status(404).body("WaterBill Id Not Found");
		}
		
	}
	
	@PutMapping("/update")
	public ResponseEntity<?> updateWaterBill(@RequestBody WaterBill wb) {
		WaterBill waterbill = service.updateWaterBill(wb);
		if(waterbill != null) {
			return ResponseEntity.ok(waterbill);
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("WaterBill ID Not Found");
		}
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteWaterBillById(@PathVariable Long id) {
		String message = service.deleteWaterBillById(id);
		return new ResponseEntity<>(message, HttpStatus.OK);
	}
	
	@GetMapping("/displaybyholdername/{name}")
	public ResponseEntity<List<WaterBill>> displayWaterBillByHolderName(@PathVariable String name) {
		List<WaterBill> wbs = service.displayWaterBillByHolderName(name);
		return ResponseEntity.status(200).body(wbs);
	}
	
	
	@GetMapping("/displaybytype/{type}")
	public ResponseEntity<List<WaterBill>> displayWaterBillByType(@PathVariable String type) {
		List<WaterBill> waterbills = service.displayWaterBillByType(type);
		return ResponseEntity.status(200).body(waterbills);
	}
	
	
	

}
