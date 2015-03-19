//
//  CurrentUser.swift
//  Lunchr
//
//  Created by Paymahn Moghadasian on 2015-03-19.
//  Copyright (c) 2015 SoftEngGroup4. All rights reserved.
//

import Foundation
import SwiftyJSON

/*
To access the email attribute do something like:

let user : Dictionary<String, JSON> = CurrentUser.currentUser!
println((user["email"]?.stringValue)!)
*/

class CurrentUser {
    private struct SubSruct {
        static var currentUser: Dictionary<String, JSON>? = nil
    }
    
    private init(){
        
    }
    
    class var currentUser: Dictionary<String, JSON>? {
        get { return SubSruct.currentUser }
        set { SubSruct.currentUser = newValue }
    }
}