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

@synthesize firstNameField;
@synthesize lastNameField;
@synthesize emailField;
@synthesize passwordField;
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
    if (![self validateLogin]) {

        [self.errorLabel setHidden:FALSE];

    } else {

        if (![HttpUtils registerUser:emailField.text toPassword:passwordField.text toFirstName:firstNameField.text toLastName:lastNameField.text]) {

            [self.errorLabel setHidden:FALSE];
            
        } else {

            [self.errorLabel setHidden:TRUE];
        
            // Move to next view
            [self performSegueWithIdentifier:@"loginSegue" sender:sender];
        }
    }
}

- (bool)validateLogin {
    
    if (   (![self.emailField hasText])
        || (![self.passwordField hasText])
        || (![self.passwordField.text isEqualToString:self.verifyField.text])
        || (![self.firstNameField hasText])
        || (![self.lastNameField hasText])) {
        
        return false;
        
    } else {
        
        return true;
    }
}

@end
