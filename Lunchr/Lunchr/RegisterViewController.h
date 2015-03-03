//
//  RegisterViewController.h
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/24/15.
//
//

#import <UIKit/UIKit.h>

@interface RegisterViewController : UIViewController

@property (strong, nonatomic) IBOutlet UITextField *firstField;
@property (strong, nonatomic) IBOutlet UITextField *lastField;
@property (strong, nonatomic) IBOutlet UITextField *emailField;
@property (strong, nonatomic) IBOutlet UITextField *passField;
@property (strong, nonatomic) IBOutlet UITextField *verifyField;
@property (strong, nonatomic) IBOutlet UILabel *errorLabel;

@end
