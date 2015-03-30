We couldn't get Frank to work with our project setup. Simimlarly, we couldn't get calablash or Kiv to work either. The biggest obstacle was the fact that we used Cocoapods for a swift project targetting a iOS version less than 8.0.

We came across seg faults, sandbox issues, double linking, lock synchronization issues and several other things. Ultimately, I think that if we either targetted a higher iOS version or used objective C instead that things would have worked out swimmingly. 

Instead, what we've done is write some fake Frank tests to illustrate what we would have liked to test had Frank (or calabash or Kiv) worked with our project. Basically, part marks? Pretty please?