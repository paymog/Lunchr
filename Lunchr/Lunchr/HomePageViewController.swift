//
//  HomePageViewController.swift
//  Lunchr
//
//  Created by Paymahn Moghadasian on 2015-03-12.
//  Copyright (c) 2015 SoftEngGroup4. All rights reserved.
//

import UIKit
import SwiftyJSON
import Socket_IO_Client_Swift

class HomePageViewController: UIViewController {

    @IBOutlet weak var matchedStatusLabel: UILabel!
    
    required init(coder aDecoder: NSCoder) {
        socket = SocketIOClient(socketURL: "http://localhost:3000")
        socket.connect()
        super.init(coder: aDecoder);
    }

    private var socket: SocketIOClient
    private let MATCHING = "Hold on while we match you with another hungry soul"
    private let MATCHED = "You've been matched with "

    override func viewDidLoad() {
        super.viewDidLoad()
        

        // Do any additional setup after loading the view.

        
        // set up socketio handling
        socket.on("hasBeenMatched", callback: {data, ack in
            println("hasbeenmatched")
            CurrentUser.currentUser = JSON(data!)[0]["user"].dictionaryValue
            
            let user = CurrentUser.currentUser!
            // hack because socket messages may not come in order
            if let matchedWith = user["matchedWith"]?.stringValue {
                if matchedWith.isEmpty{
                    self.setMatchingLabelToMatching()
                }
            }else{
                self.setMatchingLabelToMatching()
            }
            
        })
        
        
        let user = CurrentUser.currentUser!
        let email = (user["email"]?.stringValue)!
        socket.on("matched" + email, {data, ack in
            CurrentUser.currentUser = JSON(data!)[0]["user"].dictionaryValue
            self.setMatchingLabelToMatched()
        })
        
        // navigate to partial state
        if let wantsToBeMatched = user["wantsToBeMatched"]?.boolValue {
            if wantsToBeMatched {
                self.setMatchingLabelToMatching()
            }
        }
        if let matchedWith = user["matchedWith"]?.stringValue {
            if !matchedWith.isEmpty{
                self.setMatchingLabelToMatched()
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func LogoutButtonPressed(sender: AnyObject) {
        CurrentUser.currentUser = nil
        let welcome = self.storyboard?.instantiateViewControllerWithIdentifier("main") as UINavigationController
        self.presentViewController(welcome, animated: true, completion: nil)
    }
    
    @IBAction func MatchButtonPressed(sender: AnyObject) {
        let user = CurrentUser.currentUser!
//        println(user)
        let email = (user["email"]?.stringValue)!

        socket.emit("match", ["userEmail":email])
    }
    
    private func setMatchingLabelToMatching() {



            self.matchedStatusLabel.text = self.MATCHING

    }
    
    private func setMatchingLabelToMatched(){
        let user = CurrentUser.currentUser!
        self.matchedStatusLabel.text = self.MATCHED + (user["matchedWith"]?.stringValue)!
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
