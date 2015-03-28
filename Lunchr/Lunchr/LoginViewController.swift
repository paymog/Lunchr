//
//  LoginViewController.swift
//  Lunchr
//
//  Created by Paymahn Moghadasian on 2015-03-12.
//  Copyright (c) 2015 SoftEngGroup4. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class LoginViewController: UIViewController {
    
    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var errorLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
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
    
    func validateFields() -> Bool{
        var isValid = true
        
        clearBorder(emailField)
        if(!emailField.hasText() || emailField.text.rangeOfString("@") == nil){
            isValid = false
            setBorderError(emailField)
        }

        clearBorder(passwordField)
        if(!passwordField.hasText()){
            isValid = false
            setBorderError(passwordField);
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
    
    @IBAction func LoginPressed(sender: AnyObject) {
        clearErrorLabel()
        
        if !validateFields() {
            setErrorLabel("Please correct the highlighted text boxes.")
            return
        }
        
        let params: [String: AnyObject] = ["email": emailField.text, "password": passwordField.text]
        
        let request = Alamofire.request(.POST, "http://54.200.225.219/api/users/authenticate", parameters: params)
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
                    strongSelf.setErrorLabel(resultText!)
                    return
                }
                
                var serializationError: NSError?
                
                if let json: AnyObject = NSJSONSerialization.JSONObjectWithData(data!, options: .AllowFragments, error: &serializationError) {

                    let trueJSON = JSON(json)

                    CurrentUser.currentUser = trueJSON.dictionaryValue
                    let welcome = self?.storyboard?.instantiateViewControllerWithIdentifier("login") as UINavigationController
                    self?.presentViewController(welcome, animated: true, completion: nil)
                    
                } else {
                    
                    strongSelf.setErrorLabel("There was a problem with the server response. Please try again")
                    return
                }
            }
        }
    }
}
