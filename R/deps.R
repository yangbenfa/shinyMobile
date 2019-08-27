# Add an html dependency, without overwriting existing ones
appendDependencies <- function(x, value) {
  if (inherits(value, "html_dependency"))
    value <- list(value)

  old <- attr(x, "html_dependencies", TRUE)

  htmltools::htmlDependencies(x) <- c(old, value)
  x
}

# Add CSS dependencies to a tag object
addCSSDeps <- function(x) {

  # CSS
  framework7_css <- "framework7.bundle.min.css"
  framework7_icons_css <- "framework7-icons.css"
  custom_css <- "my-app.min.css"
  # material icons
  material_icons_css <- "material-icons.css"

  f7Deps <- list(
    # deps
    htmltools::htmlDependency(
      name = "framework7",
      version = "4.5.0",
      src = c(file = system.file("framework7-4.5.0", package = "shinyF7")),
      script = NULL,
      stylesheet = c(
        framework7_css,
        material_icons_css,
        custom_css,
        framework7_icons_css
      )
    )
  )
  # currently, this piece is a bit useless since
  # there is only 1 dependency. However, we never
  # what will happen later!
  appendDependencies(x, f7Deps)
}



# Add JS dependencies to a tag object
# for framework 7 htmldependency is not
# what we want in order to include js files
# we need the crapy tags$script function.
# Indeed, framework7 js deps MUUUUUUST be
# located at the end of the body.
addJSDeps <- function() {

  depsPath <- "framework7-4.5.0/"

  # JS
  framework7_js <- paste0(depsPath, "framework7.bundle.min.js")
  custom_js <- paste0(depsPath, "my-app.min.js")

  shiny::tagList(
    shiny::singleton(
      shiny::tags$script(src = framework7_js)
    ),
    shiny::singleton(
      shiny::tags$script(src = custom_js)
    )
  )
}


#' @importFrom utils packageVersion
#' @importFrom htmltools htmlDependency
f7InputsDeps <- function() {
  htmltools::htmlDependency(
    name = "framework7-bindings",
    version = as.character(packageVersion("shinyF7")),
    src = c(
      file = system.file("framework7-4.5.0/input-bindings", package = "shinyF7"),
      href = "framework7-4.5.0/input-bindings"
    ),
    package = "shinyF7",
    script = c("sliderInputBinding.js",
               "stepperInputBinding.js",
               "toggleInputBinding.js",
               "datePickerInputBinding.js",
               "pickerInputBinding.js",
               "colorPickerInputBinding.js",
               "tabsInputBinding.js",
               "dateInputBinding.js")
  )
}

