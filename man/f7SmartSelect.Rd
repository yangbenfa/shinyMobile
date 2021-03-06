% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/f7-inputs.R
\name{f7SmartSelect}
\alias{f7SmartSelect}
\title{Create a Framework7 smart select}
\usage{
f7SmartSelect(
  inputId,
  label,
  choices,
  selected = NULL,
  openIn = c("page", "sheet", "popup", "popover"),
  searchbar = TRUE,
  multiple = FALSE,
  maxlength = NULL,
  virtualList = FALSE
)
}
\arguments{
\item{inputId}{Select input id.}

\item{label}{Select input label.}

\item{choices}{Select input choices.}

\item{selected}{Default selected item.}

\item{openIn}{Smart select type: either \code{c("sheet", "popup", "popover")}.
Note that the search bar is only available when the type is popup.}

\item{searchbar}{Whether to enable the search bar. TRUE by default.}

\item{multiple}{Whether to allow multiple values. FALSE by default.}

\item{maxlength}{Maximum items to select when multiple is TRUE.}

\item{virtualList}{Enable Virtual List for smart select if your select has a lot
of options. Default to FALSE.}
}
\description{
It is smarter than the classic \link{f7Select}
}
\examples{
if (interactive()) {
library(shiny)
library(shinyMobile)

 shinyApp(
   ui = f7Page(
     title = "My app",
     f7SingleLayout(
       navbar = f7Navbar(title = "f7SmartSelect"),
       f7SmartSelect(
         inputId = "variable",
         label = "Choose a variable:",
         selected = "drat",
         choices = colnames(mtcars)[-1],
         openIn = "popup"
       ),
       tableOutput("data")
     )
   ),
   server = function(input, output) {
     output$data <- renderTable({
       mtcars[, c("mpg", input$variable), drop = FALSE]
     }, rownames = TRUE)
   }
 )
}
}
