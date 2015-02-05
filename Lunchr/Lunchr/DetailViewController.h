//
//  DetailViewController.h
//  Lunchr
//
//  Created by Sean-MacbookPro on 2/5/15.
//
//

#import <UIKit/UIKit.h>

@interface DetailViewController : UIViewController

@property (strong, nonatomic) id detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@end

