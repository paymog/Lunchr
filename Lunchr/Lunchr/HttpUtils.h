//
//  httpUtils.h
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/26/15.
//
//

#import <Foundation/Foundation.h>

#ifndef Lunchr_httpUtils_h
#define Lunchr_httpUtils_h

@interface HttpUtils : NSObject

+ (bool)loginUser:(NSString *)email toPassword:(NSString *)password;
+ (bool)registerUser:(NSString *)email toPassword:(NSString *)password toFirstName:(NSString *)firstName toLastName:(NSString *)lastName;

@end

#endif
