//
//  RegisterViewController.swift
//  Lunchr
//
//  Created by Paymahn Moghadasian on 2015-03-12.
//  Copyright (c) 2015 SoftEngGroup4. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON


public class RegisterViewController: UIViewController {

    @IBOutlet public weak var emailField: UITextField!
    @IBOutlet public weak var passwordField: UITextField!
    @IBOutlet public weak var firstNameField: UITextField!
    @IBOutlet public weak var lastNameField: UITextField!
    @IBOutlet public weak var errorLabel: UILabel!
    @IBOutlet public weak var ageField: UITextField!
    @IBOutlet public weak var radiusField: UITextField!
    
    override public func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }


    override public func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func setBorderError(textField: UITextField){
        let redBorder = UIColor(red: 1, green: 0, blue: 0, alpha: 1).CGColor
        textField.layer.borderColor = redBorder
        textField.layer.borderWidth = 1.0
        textField.layer.cornerRadius = 3.0
    }
    
    func clearBorder(textField: UITextField){
        textField.layer.borderWidth = 0.0
    }
    
    public func validateFields() -> Bool{
        var isValid = true
        
        clearBorder(emailField)
        if(!emailField.hasText() || emailField.text.rangeOfString("@") == nil){
            isValid = false
            setBorderError(emailField)
        }
        
        clearBorder(firstNameField)
        if(!firstNameField.hasText()){
            isValid = false
            setBorderError(firstNameField);
        }
        
        clearBorder(lastNameField)
        if(!lastNameField.hasText()){
            isValid = false
            setBorderError(lastNameField)
        }
        
        clearBorder(passwordField)
        if(!passwordField.hasText()){
            isValid = false
            setBorderError(passwordField);
        }
        
        clearBorder(ageField)
        if(!ageField.hasText() || ageField.text.toInt() == nil || ageField.text.toInt() < 1){
            isValid = false
            setBorderError(ageField)
        }
        
        clearBorder(radiusField)
        if(!radiusField.hasText() || radiusField.text.toInt() == nil || radiusField.text.toInt() < 1){
            isValid = false
            setBorderError(radiusField)
        }
        
        return isValid
    }
    
    private func setErrorLabel(text: String){
        errorLabel.hidden = false
        errorLabel.text = text
    }
    
    private func clearErrorLabel(){
        errorLabel.hidden = true
        errorLabel.text = ""
    }
    
    
    @IBAction func RegisterButtonPressed(sender: AnyObject) {
        clearErrorLabel()
        
        if(!validateFields()){
            setErrorLabel("Please correct the highlighted text boxes.")
            return
        }
        
        let params: [String: AnyObject] = ["email": emailField.text, "password": passwordField.text, "firstname": firstNameField.text, "lastname": lastNameField.text, "age":ageField.text.toInt()!, "radius":radiusField.text.toInt()!]
        
        let request = Alamofire.request(.POST, "http://54.200.225.219/api/users/register", parameters: params)
        request.validate()
        request.response { [weak self] request, response, data, error in
            if let strongSelf = self {
                let data = data as? NSData
                
                if data == nil {
                    strongSelf.setErrorLabel("Server didn't respond. Please try again.")
                    return
                }
                else if error != nil {
                    let resultText = NSString(data: data!, encoding: NSUTF8StringEncoding)
                    strongSelf.setErrorLabel( resultText!)
                    return
                }
                
                var serializationError: NSError?
                
                if let json: AnyObject = NSJSONSerialization.JSONObjectWithData(data!, options: .AllowFragments, error: &serializationError) {
                    
                    let jsonObject = JSON(json)
                    CurrentUser.currentUser = jsonObject.dictionaryValue
                    
                    let welcome = self?.storyboard?.instantiateViewControllerWithIdentifier("login") as UINavigationController
                    self?.presentViewController(welcome, animated: true, completion: nil)
                    
                } else {
                    
                    strongSelf.setErrorLabel("There was a problem with the server response. Please try again.")
                    return
                }
            }
        }
    }
}
