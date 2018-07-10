# Favioli 👊

## Why Favioli?
- Favicons are useful
- Opportunity for growth of use

## Building Favioli
There's definitely some overengineering in favioli
- using emoji chars is unnecessary
- modifying npm plugins for custom emoji selectors
But it's for a good reason!
- good exploration of strings, chrome extensions, and browser

- Background process
	- heart of the application, decision engine
	- Takes user settings and tab information, and sends messages to tabs.
- Content Script
	- Script that runs on each page, replacing or adding favicons
- Options
	- Basically a normal website internal to chrome
	- Page where users can add their custom favicon selections
- Popup
	- Haven't built yet, but this lets us quickly override or disable emojis for a site.

### Background.js
#### The Decision Engine
| Priority | Favicon |
|-----|-------|
| 1 | User-set Overrides |
| 2 | App Plugin Override |
| 3 | Site Default |
| 4 | Emoji Hash |

### Building  Text Favicons
- Could use images, but WHAT FUN WOULD THAT BE?!?!
- Unfortunately, favicons must be images, so we have to do hackery
- 

### Injecting Favicons

### Emoji Selector and Emoji Support

## Where do we go from here?
- Popup would be very useful
- Smarter Application Overrides; 😭 for 500 pages
- Stats for nerds
- hash seed re-roll
