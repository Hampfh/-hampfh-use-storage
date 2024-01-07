timestamp=$(shell date +%s)
pack:
	yarn build && yarn pack && rm -f example/lib.tgz && mv *.tgz example/$(timestamp).tgz && cd example && yarn remove @hampfh/use-storage ; yarn add file:./$(timestamp).tgz && rm -f $(timestamp).tgz && cd ..
