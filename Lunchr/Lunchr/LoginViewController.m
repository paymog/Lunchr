//
//  LoginViewController.m
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/18/15.
//
//

#import "LoginViewController.h"
#import "HttpUtils.h"

@implementation LoginViewController

@synthesize emailField;
@synthesize passField;
@synthesize errorLabel;

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)loginButtonTapped:(UIButton *)sender {
    
    // Show error label when input is incorrect
    // Validate login info and attempt to login user
    if (![self validateLogin] || ![HttpUtils loginUser:emailField.text toPassword:passField.text]) {
        
        [self.errorLabel setHidden:FALSE];
        [self.passField setText:@""];
    
    } else {
        
        [self.errorLabel setHidden:TRUE];
        
        // Move to next view
        [self performSegueWithIdentifier:@"loginSegue" sender:sender];
    }
}

- (bool)validateLogin {
    
    if (!((self.emailField.text && self.emailField.text.length > 0)
          || (self.passField.text && self.passField.text.length > 0))) {
        
        return false;
    
    } else {
        
        return true;
    }
}


@end
