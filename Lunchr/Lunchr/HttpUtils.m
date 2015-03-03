//
//  httpUtils.m
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/26/15.
//
//

#import "HttpUtils.h"

@implementation HttpUtils

+ (bool)registerUser:(NSString *)email
          toPassword:(NSString *)password
         toFirstName:(NSString *)firstName
          toLastName:(NSString *)lastName {
    
    @try {
        
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://54.200.225.219/api/users/register"]];
        //NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://localhost:3000/api/users/register"]];
        
        NSDictionary *jsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                        email, @"email",
                                        password, @"password",
                                        firstName, @"firstname",
                                        lastName, @"lastname",
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
    
    return true;
}

+ (bool)loginUser:(NSString *)email
       toPassword:(NSString *)password {
    
    @try {
        
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://54.200.225.219/api/users/authenticate"]];
        //NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://localhost:3000/api/users/authenticate"]];
        
        NSDictionary *jsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                        email, @"email",
                                        password, @"password",
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