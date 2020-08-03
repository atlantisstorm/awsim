# aws.i.m Introduction


 aws.i.m (AWS Instance Manager) is a basic tool for listing details of, and connecting to, AWS instances running on your platform.  The intention is that it can be used on Mac, Windows and Linux environments with minimum configuraion.

The tool is quite basic using a very small set to frameworks, node v14.15.0, electron, aws-sdk and of course React.

# Dependencies

On Windows, you should just be good to go.  ( Well on Windows 10 anyway!)
On Mac, you'll need `Microsoft Remote Desktop` installed for remote desktop connections.  Note this has only been tested with version 10 of this application. :D
On Linux, ssh should work though only tested on Ubuntu.  Nothing configured to connect to a windows box though.


# Getting Started


1. Run `git clone git@github.shuttercorp.net:atlantisstorm/awsim.git` then when complete `cd awsim`
1. Type `npm install`.
1. Open `config.json` in your favourite editor and set the `username`, `aws.accessKeyId` and `aws.secretAccessKey` values as appropriate.
1. Still in `config.json`, change mode to 'live' (or anything other than 'test') to prevent load of test data.
1. To run aws.i.m type `npm start` which will fire up the application.
1. If you're feeling extra adventureous and wish to build an executable, then run `npm run package`, you should then find your executable in the /builds directory (tested on windows 10 and Ubuntu, should just work on Mac too).
1. Check `package.json` for other `npm run ...` options.


# Basic Usage

Once started aws.i.m should automatically open a new window with the latest running instances listed.  You can filter the results in a variety of ways by selecting any of the options at the bottom of the display. Using 'Refresh Instances' button will fetch full results in the background but filter display as indicated by selected options.

You can open an ssh session to any instance by click on the Ip Address column.

You can also add your ssh credentials using ssh-add to avoid being prompted for aws passphrase each time.

All columns are sortable by clicking the column header.

You can find extra information, `Tags`, etc, about an instance by clicking on any entry which will display a modal window. Just click on it again to close.


# Trouble shooting

This should just work so the 2 mostly problems are that either nothing shows when you run `npm start` or that clicking and ip address doesn't successfully open a terminal session.

If nothing loads then most likely problem is that you're using invalid aws access values.

If clicking on ip address doesn't open a new terminal then try this command directly in an existing terminal `ssh <username>@<ip address>`

