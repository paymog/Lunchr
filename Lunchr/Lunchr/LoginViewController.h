//
//  LoginViewController.h
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/18/15.
//
//

#import <UIKit/UIKit.h>

@interface LoginViewController : UIViewController

- (IBAction)loginButtonTapped:(UIButton *)sender;

@property (strong, nonatomic) IBOutlet UITextField *emailField;
@property (strong, nonatomic) IBOutlet UITextField *passwordField;
@property (strong, nonatomic) IBOutlet UILabel *errorLabel;

@end