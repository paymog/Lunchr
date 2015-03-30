//
//  RegisterViewController.h
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/24/15.
//
//

#import <UIKit/UIKit.h>

@interface RegisterViewController : UIViewController

@property (strong, nonatomic) IBOutlet UITextField *firstNameField;
@property (strong, nonatomic) IBOutlet UITextField *lastNameField;
@property (strong, nonatomic) IBOutlet UITextField *emailField;
@property (strong, nonatomic) IBOutlet UITextField *passwordField;
@property (strong, nonatomic) IBOutlet UITextField *verifyField;
@property (strong, nonatomic) IBOutlet UILabel *errorLabel;

@end
