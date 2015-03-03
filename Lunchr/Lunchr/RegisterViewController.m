//
//  RegisterViewController.m
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/24/15.
//
//

#import "RegisterViewController.h"
#import "HttpUtils.h"

@interface RegisterViewController ()

@end

@implementation RegisterViewController

@synthesize firstField;
@synthesize lastField;
@synthesize emailField;
@synthesize passField;
@synthesize verifyField;
@synthesize errorLabel;

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)registerButtonTapped:(UIButton *)sender {

    // Show error label when input is incorrect
    // Validate login info and attempt to login user
    if (![self validateLogin] || ![HttpUtils registerUser:emailField.text toPassword:passField.text toFirstName:firstField.text toLastName:lastField.text]) {
        
        [self.errorLabel setHidden:FALSE];
        
    } else {
        
        [self.errorLabel setHidden:TRUE];
        
        // Move to next view
        [self performSegueWithIdentifier:@"loginSegue" sender:sender];
    }
}

- (bool)validateLogin {
    
    if (!(   (self.emailField.text && self.emailField.text.length > 0)
          || (self.passField.text && self.passField.text.length > 0)
          || (self.passField.text != self.verifyField.text)
          || (self.firstField.text && self.firstField.text.length > 0)
          || (self.lastField.text && self.lastField.text.length > 0))) {
        
        return false;
        
    } else {
        
        return true;
    }
}

@end
