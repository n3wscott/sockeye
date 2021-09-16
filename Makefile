# IF your sockeye source directory lives in the same parent directory as sockeye-react
# then you can use this makefile to build the frontend and update the static contents of sockeye
update:
	@cd cmd/sockeye/kodata && rm -rf www 
	@cd frontend && react-scripts build && mv build www && mv www ../cmd/sockeye/kodata/

