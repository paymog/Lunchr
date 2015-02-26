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
    // Validate login info and attempt to login user
    if (![self validateLogin] || ![self loginUser]) {
        
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

- (bool)loginUser {
    
    @try {
        
//        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://54.200.225.219/api/users/authenticate"]];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://localhost:3000/api/users/authenticate"]];
        NSDictionary *jsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                        emailField.text, @"email",
                                        passField.text, @"password",
                                        nil];
        NSError *error = nil;

        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jsonDictionary options:NSJSONWritingPrettyPrinted error:&error];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSUInteger postLength = [jsonString length];
        
        [request setHTTPMethod:@"POST"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-type"];
        [request setValue:[NSString stringWithFormat:@"%d", (int)postLength] forHTTPHeaderField:@"Content-length"];
        [request setHTTPBody:[jsonString dataUsingEncoding:NSUTF8StringEncoding]];
        
        NSHTTPURLResponse *resp;
        [NSURLConnection sendSynchronousRequest:request returningResponse:&resp error:&error];
        
        if (resp != nil && [resp statusCode] == 200) {
            
            return true;
            
        } else {
        
            return false;
        }
    
    } @catch (NSException *e) {
        
        return false;
    }
}

@end
