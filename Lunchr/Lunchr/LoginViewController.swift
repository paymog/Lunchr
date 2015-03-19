//
//  LoginViewController.swift
//  Lunchr
//
//  Created by Paymahn Moghadasian on 2015-03-12.
//  Copyright (c) 2015 SoftEngGroup4. All rights reserved.
//

import UIKit
import Alamofire

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
    
    @IBAction func LoginPressed(sender: AnyObject) {
        let params: [String: AnyObject] = ["email": emailField.text, "password": passwordField.text]
        
        let request = Alamofire.request(.POST, "http://localhost:3000/api/users/authenticate", parameters: params)
        request.validate()
        request.response { [weak self] request, response, data, error in
            if let strongSelf = self {
                let data = data as? NSData
                
                if data == nil {
                    strongSelf.errorLabel.text = "Server didn't respond. Please try again."
                    return
                }
                else if error != nil {
                    let resultText = NSString(data: data!, encoding: NSUTF8StringEncoding)
                    strongSelf.errorLabel.text = resultText
                    return
                }
                
                var serializationError: NSError?
                
                if let json: AnyObject = NSJSONSerialization.JSONObjectWithData(data!, options: .AllowFragments, error: &serializationError) {
                    
                    let welcome = self?.storyboard?.instantiateViewControllerWithIdentifier("login") as UINavigationController
                    self?.presentViewController(welcome, animated: true, completion: nil)
                    
                } else {
                    
                    strongSelf.errorLabel.text = "There was a problem with the server response. Please try again"
                    return
                }
            }
        }
    }
}
