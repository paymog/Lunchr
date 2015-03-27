//
//  HomePageViewControllerTests.swift
//  HomePageViewControllerTests
//

import UIKit
import XCTest

import Alamofire
import Socket_IO_Client_Swift
import SwiftyJSON

import Lunchr

class HomePageViewControllerTests: XCTestCase {
    
    private var matchedStatusLabel = UILabel()
    private var matchButton = UIButton()
    private var finishedButton = UIButton()
    private let viewController = HomePageViewController(coder: NSCoder())

    override func setUp() {
    
        // Set mocked UI elements
        viewController.matchedStatusLabel = matchedStatusLabel
        viewController.matchButton = matchButton
        viewController.finishedButton = finishedButton
        
        super.setUp()
    }
    
    override func tearDown() {
        super.tearDown()
    }
    
    func testValidInput() {
        
    }
}
