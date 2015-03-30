#Final Project Notes

*Selenium Notes
	*The base url for the selenium tests point to localhost if you want to test it without running locally change the base url to http://54.200.225.219/ 
	*Check the readMe.txt in /webapp/seleniumTests for more information.
*iOS Acceptance testing
	*We couldn't get the acceptance testing working with our iOS app but still wrote the tests that we would have wanted to run if it did work.
	*Check the readMe.txt in /Lunchr/Frank for more information.


# Developer Notes
* Webapp
	* When installing a new package with `npm` use the `--save` flag so it's added to the dependency list in `package.json`
	* If you're getting a dependency issue then run `npm install` to have npm install all of the appropriate dependencies
* Git
	* If using commandline, configure to always pull with rebase using `git config --global pull.rebase true`
	* The `master` branch will only ever be used on the production EC2 instance. We're going to work off the `development` branch and do weekly merges from `development` to `master`
	* No task is too small for a branch
	* General workflow should be something to the effect of (this will be changed once we actually start working):
		* Move task on trello board to "In Progress"
		* Update development branch with `git checkout development` and then `git pull`
		* Create feature branch with `git checkout -b new-feature-branch`
		* Work and make commits
		* Update development branch again (`git checkout development` and then `git pull`)
		* Checkout feature branch and rebase interactively on development (`git checkout new-feature-branch` and `git rebase -i development`)
		* Merge `new-feature-branch` into `development` with `git checkout development` followed by `git merge new-feature-branch`
		* Move task on trello board to completed