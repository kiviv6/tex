set table "mat28.pgf-plot.table"; set format "%.5f"
set samples 100.0; set parametric; plot [t=-1.0:4.0] [] [] t*(t-2)**(2),t**(2)-5*t+6
