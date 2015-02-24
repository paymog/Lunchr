//
//  LoginViewController.m
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/18/15.
//
//

#import "LoginViewController.h"

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
    if (![self validateLogin]) {
        
        [self.errorLabel setHidden:FALSE];
    } else {
        
        [self.errorLabel setHidden:TRUE];
        
        // Login user
        
        // Move to next view
        [self performSegueWithIdentifier:@"mySegue" sender:sender];
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
