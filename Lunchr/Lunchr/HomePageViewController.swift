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
    @IBOutlet weak var matchButton: UIButton!
    @IBOutlet weak var finishedButton: UIButton!
    
    required init(coder aDecoder: NSCoder) {
        socket = SocketIOClient(socketURL: "http://54.69.119.123:3000")
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
                if !matchedWith.isEmpty{
                    self.setMatchingLabel(self.MATCHED + matchedWith)
                }else
                {
                    self.setMatchingLabel(self.MATCHING)
                }
            }else{
                self.setMatchingLabel(self.MATCHING)
            }
            
        })
        
        socket.on("updated", {data, ack in
            println(JSON(data!))
            CurrentUser.currentUser = JSON(data!)[0]["user"].dictionaryValue
        })
        
        
        let user = CurrentUser.currentUser!
        let email = (user["email"]?.stringValue)!
        socket.on("matched" + email, {data, ack in
            CurrentUser.currentUser = JSON(data!)[0]["user"].dictionaryValue
            let user = CurrentUser.currentUser!
            let matchedWith = (user["matchedwith"]?.stringValue)!
            self.setMatchingLabel(self.MATCHED + matchedWith)
        })
        
        // navigate to partial state
        if let wantsToBeMatched = user["wantsToBeMatched"]?.boolValue {
            if wantsToBeMatched {
                self.setMatchingLabel(self.MATCHING)
            }
        }
        if let matchedWith = user["matchedWith"]?.stringValue {
            if !matchedWith.isEmpty{
                self.setMatchingLabel(self.MATCHED + matchedWith)
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
    
    @IBAction func FinishedEatingButtonPressed(sender: AnyObject) {
        let user = CurrentUser.currentUser!
        let email = (user["email"]?.stringValue)!
        
        socket.emit("finished", ["userEmail": email])
        clearMatchingLabel()
        
    }
    @IBAction func MatchButtonPressed(sender: AnyObject) {
        let user = CurrentUser.currentUser!
        let email = (user["email"]?.stringValue)!

        socket.emit("match", ["userEmail":email])
    }
    
    
    private func clearMatchingLabel(){
        self.matchedStatusLabel.hidden = true
        self.matchedStatusLabel.text = ""
        finishedButton.hidden = true
        matchButton.hidden = false
    }
    
    private func setMatchingLabel(text: String){
        self.matchedStatusLabel.text = text
        self.matchedStatusLabel.hidden = false
        finishedButton.hidden = false
        matchButton.hidden = true
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
