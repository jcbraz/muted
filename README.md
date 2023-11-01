# _muted_

_A simple script to mute posts and stories of your irrelevant instagram following users and focus on what really matters._

## Requirements

- Node.js (https://nodejs.org/en)

## Installation

1. Clone this repository
2. Run `npm install` in the cloned directory
3. Create an `.env` file in the cloned directory and add your instagram username and password as follows (as states in `.env.example` file)):
```
IG_USERNAME='your_username'
IG_PASSWORD='your_password'
```
4. Modify the `notToMute` array in `muted.ts` in order to add users you don't want to mute (optional)
5. Compile the TypeScript code with `tsc muted.ts`
6. Run the script with `node muted.js`
7. Get some coffee. It might take a while.
8. Enjoy your muted feed!
