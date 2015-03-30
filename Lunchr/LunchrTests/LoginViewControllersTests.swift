//
//  LoginViewControllerTests.swift
//  LoginViewControllerTests
//

import UIKit
import XCTest

import Alamofire
import Socket_IO_Client_Swift
import SwiftyJSON

import Lunchr

class LoginViewControllerTests: XCTestCase {
    
    private let viewController = LoginViewController()
    private var emailTextField = UITextField()
    private var passwordTextField = UITextField()
    private var errorLabel = UILabel()
    
    override func setUp() {
        
        // Set mocked UI elements
        viewController.emailField = emailTextField
        viewController.passwordField = passwordTextField
        viewController.errorLabel = errorLabel

        super.setUp()
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    func testValidateFieldsValidInput() {

        emailTextField.text = "example@gmail.com"
        passwordTextField.text = "password"
        
        var isValid = viewController.validateFields()

        XCTAssertEqual(isValid, true, "Valid input")
    }
    
    func testValidateFieldsInvalidInput() {
        
        emailTextField.text = "asdf"
        passwordTextField.text = "asdf"

        var isValid = viewController.validateFields()
        
        XCTAssertEqual(isValid, false, "Invalid input")
    }
    
    func testValidateFieldsEmptyInput() {

        emailTextField.text = ""
        passwordTextField.text = ""
        
        var isValid = viewController.validateFields()
        
        XCTAssertEqual(isValid, false, "Empty input")
    }
}
