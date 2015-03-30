Scenario: Successfully registering a new user
Given I'm on the Register screen
And I type paymahn1@gmail.com in the emailField text field
And I type Paymahn in the firstNameField text field
And I type Moghadasian in the lastNameField text field
And I type password in the passwordField text field
And I type 10 in the ageField text field
And I type 10 in the radiusField text field
When I touch the button marked "Register"
Then I should be on the Home screen

Scenario: Registering a new user with unfilled fields
Given I'm on the Register screen
And I type paymahn1@gmail.com in the emailField text field
And I type Paymahn in the firstNameField text field
# And I type Moghadasian in the lastNameField text field ## didn't fill this field
And I type password in the passwordField text field
And I type 10 in the ageField text field
And I type 10 in the radiusField text field
When I touch the button marked "Register"
Then I should be on the Register screen
And I should see an element of class Label with name errorLabel

Scenario: Registering with an in-use email
Given I'm on the Register screen
And I type paymahn1@gmail.com in the emailField text field # same email as before
And I type Paymahn in the firstNameField text field # all fields need to be filled for this test
And I type Moghadasian in the lastNameField text field 
And I type password in the passwordField text field
And I type 10 in the ageField text field
And I type 10 in the radiusField text field
When I touch the button marked "Register"
Then I should be on the Register screen
And I should see an element of class Label with name errorLabel