build=1
if [[ ${CIRCLE_BRANCH} == "master" ]]; then
    build=0
    echo "CURRENT BRANCH is ${CIRCLE_BRANCH} not build"
    exit 0
fi

git diff --name-only $(git merge-base -a HEAD origin/master) | cut -d/ -f1 | sort -u > projects

echo -e "Modified directories:\n`cat projects`\n"

# Build affected projects and their dependencies
projects_inc_dep=(`cat projects`)
echo -e "Calculating dependencies\n"
for dir in `ls -d */`; do
    for dep in `go list -f '{{ .Deps }}' ./${dir} 2>/dev/null`; do
        for project_dep in `echo $dep | grep github.com/tufin/$CIRCLE_PROJECT_REPONAME | egrep -v "vendor|${dir%\/}"`; do
            if [[ " ${projects_inc_dep[@]} " =~ " ${project_dep##*\/} " ]] && ! [[ " ${projects_inc_dep[@]} " =~ " ${dir%\/} " ]]; then
                projects_inc_dep+=(${dir%\/})
            fi
        done
    done
done
echo -e "Building: ${projects_inc_dep[@]}\n"
for project in ${projects_inc_dep[@]}; do
    if grep -Fxq $project project-dirs; then
        printf "\nTriggerring build for project: "$project
        curl -s -u ${CIRCLE_TOKEN}: \
        -d build_parameters[CIRCLE_JOB]=build_${project} \
        --data revision=$CIRCLE_SHA1 \
        https://circleci.com/api/v1.1/project/github/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/tree/$CIRCLE_BRANCH
    fi
done