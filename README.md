## Overview

Process MySQL data via streams.

## Data processors

- It process incoming data from the pipe
  - After data manipulation, it should **always** push data, resume the pipe, and call `next();`
- Every processor should handle its own errors
- Every processor should be plugable, modular, and contained in itself/isolated
