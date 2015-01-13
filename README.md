# Developer Notes
* Webapp
	* When installing a new package with `npm` use the `--save` flag so it's added to the dependency list in `package.json`
	* If you're getting a dependency issue then run `npm install` to have npm install all of the appropriate dependencies
* Git
	* If using commandline, configure to always pull with rebase using `git config --global pull.rebase true`
	* The `master` branch will only ever be used on the production EC2 instance. We're going to work off the `development` branch and do weekly merges from `development` to `master`
	* No task is too small for a branch
	
