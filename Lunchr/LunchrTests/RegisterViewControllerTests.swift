//
//  RegisterViewControllerTests.swift
//  RegisterViewControllerTests
//

import UIKit
import XCTest

import Alamofire
import Socket_IO_Client_Swift
import SwiftyJSON

import Lunchr

class RegisterViewControllerTests: XCTestCase {
    
    private let viewController = RegisterViewController()
    private var emailField = UITextField()
    private var passwordField = UITextField()
    private var firstNameField = UITextField()
    private var lastNameField = UITextField()
    private var ageField = UITextField()
    private var radiusField = UITextField()
    private var errorLabel = UILabel()
    
    override func setUp() {
        
        // Set mocked UI elements
        viewController.emailField = emailField
        viewController.passwordField = passwordField
        viewController.firstNameField = firstNameField
        viewController.lastNameField = lastNameField
        viewController.ageField = ageField
        viewController.radiusField = radiusField
        viewController.errorLabel = errorLabel
        
        super.setUp()
    }
    
    override func tearDown() {
        super.tearDown()
    }
    
    func testValidateFieldsValidInput() {
        
        emailField.text = "example@gmail.com"
        passwordField.text = "password"
        firstNameField.text = "first"
        lastNameField.text = "last"
        ageField.text = "34"
        radiusField.text = "3"
        
        var isValid = viewController.validateFields()
        
        XCTAssertEqual(isValid, true, "Valid input")
    }
    
    func testValidateFieldsInvalidInput() {

        emailField.text = "example"
        passwordField.text = "password"
        firstNameField.text = "first"
        lastNameField.text = "last"
        ageField.text = "34"
        radiusField.text = "3"
        
        var isValid = viewController.validateFields()
        
        XCTAssertEqual(isValid, false, "Invalid input")

    }
    
    func testValidateFieldsEmptyInput() {
        
        emailField.text = ""
        passwordField.text = ""
        firstNameField.text = ""
        lastNameField.text = ""
        ageField.text = ""
        radiusField.text = ""
        
        var isValid = viewController.validateFields()
        
        XCTAssertEqual(isValid, false, "Empty input")

    }
    
    func testValidateFieldsInvalidAge() {

        emailField.text = "example"
        passwordField.text = "password"
        firstNameField.text = "first"
        lastNameField.text = "last"
        ageField.text = "-94"
        radiusField.text = "3"
        
        var isValid = viewController.validateFields()
        
        XCTAssertEqual(isValid, false, "Invalid age")

    }
    
    func testValidateFieldsInvalidRadius() {

        emailField.text = "example"
        passwordField.text = "password"
        firstNameField.text = "first"
        lastNameField.text = "last"
        ageField.text = "34"
        radiusField.text = "-34"
        
        var isValid = viewController.validateFields()
        
        XCTAssertEqual(isValid, false, "Invalid radius")

    }
}
