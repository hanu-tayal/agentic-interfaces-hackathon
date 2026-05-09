# Print Delivery Requirement

## Product Requirement

Bedtime School Bridge should make it easy to print the daily bedtime material so the parent has a physical page or mini-book to read with the child every night.

The product should support:

- print at home
- save as PDF
- daily print pack
- weekly mini-book
- parent approval before printing
- future print-shop fulfillment

## Current Local Feasibility

Local printer check on the development machine:

- `lpstat -d` reports no system default destination.
- `lpstat -p` did not return a usable printer list from the shell.

Implication:

- The hackathon MVP should not depend on a configured system printer.
- Use browser print and PDF export as the reliable path.
- If a printer is configured later, the same print-ready page can go through the OS print dialog.

## Home Printer Path

For Mac/iPhone/iPad households, the most pragmatic path is AirPrint or the native browser print dialog.

Apple AirPrint supports driverless printing from Apple devices to compatible printers on the same Wi-Fi network. For the product, this means:

- generate a clean printable HTML/PDF view
- call browser print or show a `Print` button
- let the operating system choose the printer
- avoid silent/background printing

## Hackathon MVP

Implement:

1. Print-ready route or modal for tonight's story.
2. Browser `window.print()` button.
3. `Save as PDF` guidance through the print dialog.
4. Black-and-white mode.
5. Large toddler-friendly typography.
6. Parent script and child page as separate print sections.
7. Print preview inside the generated UI.

Do not implement:

- background print jobs
- direct printer driver integration
- automatic daily printing without parent approval
- real print-shop orders

## Daily Print Ritual

Target workflow:

1. Daycare email arrives.
2. Agent generates tonight's bridge.
3. Parent clicks `Make printable`.
4. App creates:
   - one parent read-aloud page
   - one child story/coloring page
   - one tomorrow follow-up card
5. Parent clicks `Print tonight`.
6. Browser/OS print dialog opens.

## Future Local Printer Integration

Future desktop/server flow:

- discover configured printers through OS/CUPS
- show printer name and status
- let parent choose printer, paper size, color mode, and copies
- require explicit approval before each print job
- keep a print audit trail

Safety rule:

- The agent may prepare a print job, but the parent approves the actual print.

## Future Print-Shop Fulfillment

For parents without a home printer, support print-shop fulfillment later:

- generate a print-ready PDF
- let parent choose local pickup or delivery
- show cost, pickup time, address, and privacy warning
- require explicit approval before sending private child content to a third-party service

This should use the same purchase approval rail as toy commerce:

- parent-controlled budget
- AP2-style signed mandate in future implementations
- mock receipt in hackathon demo
- no real purchase in MVP

## Privacy Rules

- Do not include raw daycare email text in printed material.
- Do not include private teacher/parent names unless parent opts in.
- Do not print child photos by default.
- Do not send print jobs to third-party services without explicit approval.
- Keep the default output generic enough to be safely left on a kitchen counter.

